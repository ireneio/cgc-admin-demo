import { Context } from '@nuxt/types'
import { ResponseObject } from 'Http'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account'
}

async function verification(type: string, token: string): Promise<any> {
  const result: ResponseObject = await $apiUser.post('/admin/verification', {}, { headers: { authorization: `Bearer ${token}` } })
  return httpResponseMapper(result)
}

export async function authHelper(failPath: string, successPath: string, ctx: Context, type: string) {
  const { store, redirect } = ctx
  const token = window.localStorage.getItem('tkn')
  // let attempts = 0
  if (token !== 'undefined' && token !== undefined && token !== null) {
    try {
      const verificationResult = await verification(type, token)
      if (verificationResult?.data?.length && isSignInPage(ctx)) {
        redirect(successPath)
      } else if (verificationResult?.error) {
        throw new Error('401')
      }
    } catch (e: unknown) {
      redirect(failPath)
    }
  } else {
    !isSignInPage(ctx) && redirect(failPath)
  }
}
