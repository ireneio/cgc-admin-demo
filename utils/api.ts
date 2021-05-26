import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { NuxtCookies } from 'cookie-universal-nuxt'
import { AxiosInstance } from 'axios'

let $nuxtAxiosInstance: NuxtAxiosInstance
// eslint-disable-next-line import/no-mutable-exports
let $api: AxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $nuxtAxiosInstance = axiosInstance
  $api = $nuxtAxiosInstance.create({
    baseURL: process.env.PROXY_URL,
    timeout: 20000
  })
}

// eslint-disable-next-line import/no-mutable-exports
let $cookies: NuxtCookies

export function initializeCookies(cookiesInstance: NuxtCookies) {
  $cookies = cookiesInstance
}

export { $api, $cookies }
