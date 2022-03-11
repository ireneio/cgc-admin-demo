import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosInstance } from 'axios'

let $nuxtAxiosInstance: NuxtAxiosInstance
// eslint-disable-next-line import/no-mutable-exports
let $apiUser: NuxtAxiosInstance
let $apiPlatform: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $nuxtAxiosInstance = axiosInstance
  $apiUser = $nuxtAxiosInstance.create({
    baseURL: process.env.API_USER_URL,
    timeout: 20000
  })
  $apiPlatform = $nuxtAxiosInstance.create({
    baseURL: process.env.API_PLATFORM_URL,
    timeout: 20000
  })
}

export { $apiUser, $apiPlatform }
