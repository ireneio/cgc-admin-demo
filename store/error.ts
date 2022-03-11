import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { ResponseObject } from 'Http'
import { $apiUser } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'

interface Error {
  active: boolean,
  message: string,
  code: number
}
@Module({
  name: 'error',
  stateFactory: true,
  namespaced: true
})
export default class ErrorModule extends VuexModule {
  private _error: Error = {
    active: false,
    message: '',
    code: 0
  }

  public get message(): string {
    return this._error.message
  }

  public get isActive(): boolean {
    return this._error.active
  }

  @Mutation
  public setError(payload: Error) {
    this._error = { ...payload }
  }

  @Mutation
  public clearError() {
    this._error = { active: false, message: '', code: 0 }
  }
}
