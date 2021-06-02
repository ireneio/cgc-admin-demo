import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { SignInForm, User } from 'SignIn'
import { ResponseObject } from 'Http'
import { $api } from '~/utils/api'
import { httpResponseMapper } from '~/utils/http'
import { dateDisplayYYYYMMDDHHMMSS } from '~/utils/date'

@Module({
  name: 'transaction',
  stateFactory: true,
  namespaced: true
})
export default class TransactionModule extends VuexModule {
  private _transaction: any[] = []

  public get transaction(): any[] {
    return this._transaction.map((item: any) => {
      return {
        ...item,
        created_at: dateDisplayYYYYMMDDHHMMSS(item.created_at)
      }
    })
  }

  @Mutation
  private setTransaction(payload: any[]) {
    this._transaction = payload
  }

  @Action({ commit: 'setTransaction' })
  public async getTransaction() {
    try {
      const result: ResponseObject = await $api.get('/transaction')
      return httpResponseMapper(result)
    } catch (e) {
      throw new Error(e)
    }
  }
}
