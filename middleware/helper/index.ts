import { Context } from '@nuxt/types'
import { authStore } from '~/store'

function isSignInPage(ctx: Context): boolean {
  return ctx.route.name === 'account'
}

export async function authHelper(failPath: string, successPath: string, ctx: Context, type: string) {
  const { store, redirect } = ctx
  try {
    const creds = window.localStorage.getItem('creds')
    let _creds = { email: '', password: '' }
    if (creds) {
      _creds = JSON.parse(creds)
    }
    const signInResult = await authStore.getTokenLocal(_creds)
    if (!signInResult) {
      redirect(failPath)
    }
  } catch (e: unknown) {
    !isSignInPage(ctx) && redirect(failPath)
  }
}
