import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class AuthModule extends VuexModule {
  private tokenLocal: string = ''

  public info: Record<string, any> = {
    id: 0,
    email: '',
    roles: [
      {
        createdAt: "2022-04-29T05:47:34.945Z",
        id: 4,
        roleDescription: "Guild admin",
        roleName: "guildAdmin",
        updatedAt: "2022-04-29T05:47:34.945Z",
      }
    ],
    organization: {
      id: 0,
      isActive: false,
      name: '',
      type: 0
    },
    needChangePassword: false,
    token: '',
    username: ''
  }

  public get access_level() {
    return this.info.access_level
  }

  public get id() {
    return this.info.id
  }

  @Mutation
  public setInfo(payload: any) {
    console.log(payload);

    this.info = payload
  }

  @Mutation
  private setTokenLocal(payload: { t: string, email: string, id: string }) {
    const { t, email, id } = payload
    this.tokenLocal = t
    this.info = { ...this.info, email, id }
    window.localStorage.setItem('t', t)
  }

  @Action({ commit: 'setTokenLocal' })
  public async getTokenLocal({ email, password }: { email: string, password: string }) {
    const payload = {
      email,
      password
    }

    try {
      const login: ResponseObject = await $apiUser.post('/users/login', payload)
      const result = httpResponseMapper(login)
      if (result?.id && result?.isActive) {
        window.localStorage.setItem('creds', JSON.stringify(payload))
        this.setInfo(result)
        return true
      } else {
        window.localStorage.removeItem('creds')
        return false
      }
    } catch (e: any) {
      throw new Error(e)
    }
  }
}
