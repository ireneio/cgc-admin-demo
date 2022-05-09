/* eslint-disable no-console */
import { errorStore } from '~/store/'

export function httpResponseMapper(result: any, next?: Function, nextArgs?: any[]) {
  const { data } = result
  try {
    if (data) {
      return data
    }
    throw new Error(`api error`)
  } catch (e: unknown) {
    console.log(`[Http Error] ${String(e)}`)
    errorStore.setError({ active: true, message: String(e), code: 500 })
    return {
      error: `[Http Error] ${String(e)}`
    }
  }
}
