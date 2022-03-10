/* eslint-disable no-console */
import { errorStore } from '~/store/'

export function httpResponseMapper(result: any, next?: Function, nextArgs?: any[]) {
  const { data: { statusCode, statusMsg, data } } = result  
  try {
    switch (statusCode) {
      case 200:
        return data
      default:
        throw new Error(`${statusCode}~${statusMsg}`)
    }
  } catch (e: unknown) {
    console.log(`[Http Error] ${String(e)}`)
    errorStore.setError({ active: true, message: statusMsg, code: Number(statusCode) })
    return {
      error: `[Http Error] ${statusMsg}`
    }
  }
}
