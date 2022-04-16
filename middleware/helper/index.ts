import { Context } from '@nuxt/types'
import { ResponseObject } from 'Http'
import { authStore } from '~/store'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account'
}

async function verification(token: string): Promise<any> {
  const result: ResponseObject = await $apiUser.post('/admin/verification', {}, { headers: { authorization: `Bearer ${token}` } })
  return httpResponseMapper(result)
}

async function verificationArtist(token: string): Promise<any> {
  const result: ResponseObject = await $apiUser.post('/member/artists/verification', {}, { headers: { authorization: `Bearer ${token}` } })
  return httpResponseMapper(result)
}

function setInfoInStore(data: any[]) {
  const { access_level, email, id } = data[0]
  authStore.setInfo({ access_level, email, id })
}

function checkVerificationInfo(verificationResult: any, ctx: Context, successPath: string) {
  if (verificationResult?.data?.length && isSignInPage(ctx)) {
    setInfoInStore(verificationResult.data)
    ctx.redirect(successPath)
  } else if (verificationResult?.error) {
    return false
  } else if (verificationResult?.data?.length) {
    setInfoInStore(verificationResult.data)
  }
  return true
}

export async function authHelper(failPath: string, successPath: string, ctx: Context, type: string) {
  const { store, redirect } = ctx
  const token = window.localStorage.getItem('tkn')
  // let attempts = 0
  if (token !== 'undefined' && token !== undefined && token !== null) {
    try {
      const verificationResult = await verification(token)
      if (!checkVerificationInfo(verificationResult, ctx, successPath)) {
        throw new Error('401')
      }
    } catch (e: unknown) {
      const verificationResultArtist = await verificationArtist(token)
      if (!checkVerificationInfo(verificationResultArtist, ctx, successPath)) {
        redirect(failPath)
      } else {
        return
      }
    }
  } else {
    !isSignInPage(ctx) && redirect(failPath)
  }
}
