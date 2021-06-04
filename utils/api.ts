import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { AxiosInstance } from 'axios'

let $nuxtAxiosInstance: NuxtAxiosInstance
// eslint-disable-next-line import/no-mutable-exports
let $api: AxiosInstance
// eslint-disable-next-line import/no-mutable-exports
let $apiFe: AxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $nuxtAxiosInstance = axiosInstance
  $api = $nuxtAxiosInstance.create({
    baseURL: process.env.PROXY_URL,
    timeout: 20000,
    headers: {
      area: 'admin'
    }
  })
  $apiFe = $nuxtAxiosInstance.create({
    baseURL: process.env.PROXY_URL,
    timeout: 20000,
    headers: {
      area: 'fe'
    }
  })
}

export { $api, $apiFe }
