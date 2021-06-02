/* eslint-disable no-console */
import { errorStore } from '~/store/'

export function httpResponseMapper(result: any, next?: Function, nextArgs?: any[]) {
  // console.log(result)
  const { data: { statusCode, statusMsg, data } } = result
  try {
    switch (statusCode) {
      case 200:
        return data
      default:
        throw new Error(statusMsg)
    }
  } catch (e) {
    console.log(`[Http Error] ${e.message}`)
    errorStore.setError({ active: true, message: e.message })
    return {
      error: `[Http Error] ${e.message}`
    }
  }
}
