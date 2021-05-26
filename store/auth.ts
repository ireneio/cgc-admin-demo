import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { SignInForm, User } from 'SignIn'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true
})
export default class AuthModule extends VuexModule {
  public user: User | null = {
    clientserialno: '',
    accountid: '',
    username: '',
    email: '',
    birth: '',
    nickname: '',
    gender: 0,
    photopath: '',
    address: '',
    phonenumber: '',
    mobilephonenumber: '',
    mobileVerifyStatus: 0,
    memberLevel: 0,
    isfirstlogin: false,
    accountAttribute: 0,
    mainGroup: '',
    groups: [],
    isPasswordExpired: false
  }

  private tokenLocal: string = ''

  public info = {
    email: '',
    id: 0
  }

  @Mutation
  private setTokenLocal(payload: { t: string, email: string, id: number }) {
    const { t, email, id } = payload
    this.tokenLocal = t
    this.info = { email, id }
    window.localStorage.setItem('t', t)
  }

  @Action({ commit: 'setTokenLocal' })
  public async getTokenLocal({ email, password }: { email: string, password: string }) {
    const requestBody = {
      email,
      password
    }

    try {
      const result: ResponseObject = await $api.post('/auth/local/signIn', requestBody)
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }
}
