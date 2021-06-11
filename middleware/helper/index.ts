import { Context } from '@nuxt/types'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account' || ctx.route.name === 'v1-account'
}

async function verification(type: string, token: string): Promise<any> {
  const result: ResponseObject = await $api.get('/auth/local/verify', { headers: { Authorization: `Bearer ${token}`, area: 'm' } })
  return httpResponseMapper(result)
}

async function tokenAcquisition(type: string, ctx: Context): Promise<any> {
  const { email, id } = ctx.store.state.auth.info
  const result = await $api.get(`/auth/local?email=${email}&id=${id}`)
  return httpResponseMapper(result)
}

async function profile(type: string, token: string, ctx: Context): Promise<any> {
  const { email } = ctx.store.state.auth.info
  const result: ResponseObject = await $api.get(
    `/auth/local/info?email=${email}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return httpResponseMapper(result)
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
        store.commit('auth/setTokenLocal', verificationResult)
        const profileResult = await profile(type, token, ctx)
        store.commit('auth/setInfo', profileResult)
      }
    } catch (e) {
      // !isSignInPage(ctx) && redirect(failPath)
      redirect(failPath)
    }
  } else {
    !isSignInPage(ctx) && redirect(failPath)
  }
}
