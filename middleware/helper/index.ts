import { Context } from '@nuxt/types'
import { ResponseObject } from 'Http'
import { $api, $apiFe } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account' || ctx.route.name === 'v1-account'
}

async function verification(type: string, token: string): Promise<any> {
  if (type === 'admin') {
    const result: ResponseObject = await $api.get('/auth/local/verify', { headers: { Authorization: `Bearer ${token}` } })
    return httpResponseMapper(result)
  } else {
    const result: ResponseObject = await $apiFe.get('/auth/local/verify', { headers: { Authorization: `Bearer ${token}` } })
    return httpResponseMapper(result)
  }
}

async function tokenAcquisition(type: string, ctx: Context): Promise<any> {
  const { email, id } = ctx.store.state.auth.info
  if (type === 'admin') {
    const result = await $api.get(`/auth/local?email=${email}&id=${id}`)
    return httpResponseMapper(result)
  } else {
    const result = await $apiFe.get(`/auth/local?email=${email}&id=${id}`)
    return httpResponseMapper(result)
  }
}

async function profile(type: string, token: string): Promise<any> {
  if (type === 'admin') {
    const result: ResponseObject = await $api.get(
      '/auth/local/info',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return httpResponseMapper(result)
  } else {
    const result: ResponseObject = await $apiFe.get(
      '/auth/local/info',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return httpResponseMapper(result)
  }
}

export async function authHelper(failPath: string, successPath: string, ctx: Context, type: string) {
  const { store, redirect } = ctx
  const token = window.localStorage.getItem('t')
  let attempts = 0
  if (token !== 'undefined' && token !== undefined && token !== null) {
    try {
      const verificationResult = await verification(type, token)
      if (!verificationResult.t) {
        if (attempts >= 2) {
          attempts = 0
          redirect(failPath)
        }
        const { accessToken: tokenNew } = await tokenAcquisition(type, ctx)
        // if (!tokenNew) {
        //   redirect('/')
        // }
        await verification(type, tokenNew)
        attempts += 1
        window.localStorage.setItem('t', tokenNew)
      } else if (isSignInPage(ctx)) {
        redirect(successPath)
      } else {
        const profileResult = await profile(type, token)
        store.commit('auth/setTokenLocal', verificationResult)
        store.commit('auth/setInfo', profileResult)
      }
    } catch (e) {
      console.log('reach error')
      // !isSignInPage(ctx) && redirect(failPath)
      redirect(failPath)
    }
  } else {
    !isSignInPage(ctx) && redirect(failPath)
  }
}
