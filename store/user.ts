import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import { dateDisplayYYYYMMDD, dateDisplayYYYYMMDDHHMMSS } from '~/utils/date'

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})
export default class UserModule extends VuexModule {
  private _adminUsers: any[] = []

  private _users: any[] = []

  private _wallets: any[] = []

  public get adminUsers(): any[] {
    return this._adminUsers.map((item: any) => {
      return {
        ...item,
        created_at: dateDisplayYYYYMMDDHHMMSS(item.created_at),
        access_level: item.access_level === '6' ? '管理員' : '現場人員',
        status: item.status ? '啟用' : '停用'
      }
    })
  }

  public get users(): any[] {
    return this._users.map((item: any) => {
      return {
        ...item,
        created_at: dateDisplayYYYYMMDDHHMMSS(item.created_at),
        last_login: dateDisplayYYYYMMDDHHMMSS(item.last_login),
        access_level: item.access_level === '2' ? '會員' : '訪客',
        status: item.status ? '啟用' : '停用'
      }
    })
  }

  public get wallets(): any[] {
    return this._wallets
  }

  @Mutation
  private setAdminUsers(payload: any[]) {
    this._adminUsers = payload
  }

  @Mutation
  private setUsers(payload: any[]) {
    this._users = payload
  }

  @Mutation
  private setWallets(payload: any[]) {
    this._wallets = payload
  }

  @Action({ commit: 'setAdminUsers' })
  public async getAdminUsers() {
    try {
      const result: ResponseObject = await $api.get('/user/admin')
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  @Action({ commit: 'setUsers' })
  public async getUsers() {
    try {
      const result: ResponseObject = await $api.get('/user')
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }

  @Action({ commit: 'setWallets' })
  public async getWallets(userId: string) {
    try {
      const result: ResponseObject = await $api.get(`/wallet?userId=${userId}`)
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }
}
