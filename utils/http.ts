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
        throw new Error(`${statusCode}~${statusMsg}`)
    }
  } catch (e) {
    const [statusCode, statusMsg] = e.message.split('~')
    console.log(`[Http Error] ${statusMsg}`)
    errorStore.setError({ active: true, message: statusMsg, code: Number(statusCode) })
    return {
      error: `[Http Error] ${statusMsg}`
    }
  }
}
