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

  public info = {
    email: '',
    id: '0',
    access_level: '0'
  }

  @Mutation
  public setInfo(payload: { email: string, id: string, access_level: string }) {
    this.info = { ...payload }
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
    const requestBody = {
      email,
      password
    }

    try {
      const result: ResponseObject = await $apiUser.post('/auth/local/signIn', requestBody)
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }
}
