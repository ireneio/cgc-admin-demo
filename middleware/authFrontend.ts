import { Context } from '@nuxt/types'
import { authHelper } from './helper/'

const successPath = '/v1'
const failPath = '/v1/account'

export default async function(ctx: Context) {
  await authHelper(failPath, successPath, ctx, 'fe')
}
