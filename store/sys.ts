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
  private _settingList: any = {}

  private _config: any = {}

  public get isRoundActive(): boolean {
    return Object.keys(this.config).length === 0 ? false : this.config.currentRoundId !== ''
  }

  public get settingList() {
    return this._settingList
  }

  public get config() {
    return this._config
  }

  @Mutation
  setSettingList(payload: any) {
    this._settingList = payload
  }

  @Mutation
  setConfig(payload: any) {
    this._config = payload
  }

  @Action({ commit: 'setSettingList' })
  public async getSettingList() {
    const result: ResponseObject = await $api.get('/setting?versionId=1.0.0')
    return httpResponseMapper(result)
  }

  @Action({ commit: 'setConfig' })
  public async getConfig() {
    const result: ResponseObject = await $api.get('/config')
    return httpResponseMapper(result)
  }
}
