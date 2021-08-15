import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Module({
  name: 'sys',
  stateFactory: true,
  namespaced: true
})
export default class SysModule extends VuexModule {
  private _config: any = {}

  public get config() {
    return this._config
  }

  @Mutation
  setConfig(payload: any) {
    this._config = payload
  }

  @Action({ commit: 'setConfig' })
  public async getConfig() {
    const result: ResponseObject = await $api.get('/config')
    return httpResponseMapper(result)
  }
}
