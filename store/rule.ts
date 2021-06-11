import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Module({
  name: 'rule',
  stateFactory: true,
  namespaced: true
})
export default class RuleModule extends VuexModule {
  private _ruleList: any[] = []

  public get ruleList(): any[] {
    return this._ruleList
  }

  @Mutation
  private setRuleList(payload: any[]) {
    this._ruleList = payload
  }

  @Action({ commit: 'setRuleList' })
  public async getRuleList({ type }: { type: string }) {
    try {
      const result: ResponseObject = await $api.get(`/rule?type=${type}`)
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }
}
