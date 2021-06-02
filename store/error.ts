import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

@Module({
  name: 'error',
  stateFactory: true,
  namespaced: true
})
export default class ErrorModule extends VuexModule {
  private _error = {
    active: false,
    message: ''
  }

  public get errorMessage(): string {
    return this._error.message
  }

  public get isActive(): boolean {
    return this._error.active
  }

  @Mutation
  public setError(payload: { active: boolean, message: string }) {
    this._error = { ...payload }
  }
}
