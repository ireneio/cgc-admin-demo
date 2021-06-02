import { Context } from '@nuxt/types'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account'
}

async function verification(token: string): Promise<any> {
  const result: ResponseObject = await $api.get('/auth/local/verify', { headers: { Authorization: `Bearer ${token}` } })
  return httpResponseMapper(result)
}

async function tokenAcquisition(ctx: Context): Promise<any> {
  const { email, id } = ctx.store.state.auth.info
  const result = await $api.get(`/auth/local?email=${email}&id=${id}`)
  return httpResponseMapper(result)
}

async function profile(token: string): Promise<any> {
  const result: ResponseObject = await $api.get(
    '/auth/local/info',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return httpResponseMapper(result)
}

export default async function(ctx: Context) {
  const { store, redirect, route } = ctx
  const token = window.localStorage.getItem('t')
  if (token !== 'undefined' && token !== undefined && token !== null) {
    try {
      const verificationResult = await verification(token)
      if (!verificationResult.t) {
        // throw new Error('verification error')

        const { accessToken: tokenNew } = await tokenAcquisition(ctx)
        await verification(tokenNew)
        window.localStorage.setItem('t', tokenNew)
      } else if (isSignInPage(ctx)) {
        redirect('/')
      } else {
        const profileResult = await profile(token)
        store.commit('auth/setTokenLocal', verificationResult)
        store.commit('auth/setInfo', profileResult)
      }
    } catch (e) {
      !isSignInPage(ctx) && redirect('/account')
    }
  } else {
    !isSignInPage(ctx) && redirect('/account')
  }
}
