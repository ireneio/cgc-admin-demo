import { Context } from '@nuxt/types'
import { authHelper } from './helper/'

const successPath = '/record'
const failPath = '/account'

export default async function(ctx: Context) {
  await authHelper(failPath, successPath, ctx, 'admin')
}
