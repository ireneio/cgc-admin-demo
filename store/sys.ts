import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
// import { $axios } from '~/utils/api'
import { ProxyRequestObject, ResponseObject } from 'Http'
// import store from './index'
@Module({
  name: 'sys',
  stateFactory: true,
  namespaced: true
  // dynamic: true,
  // store
})
export default class SysModule extends VuexModule {
  public accountList: Array<any> = []

  @Mutation
  setAccountList(payload: any) {
    this.accountList = [...payload]
  }

  // @Action({ commit: 'setAccountList' })
  // public async getAccountList({ token }: any) {
  //   try {
  //     const result: ResponseObject = await $axios.get('/user/', { headers: { Authorization: token }})
  //     switch (Number(result.data.statusCode)) {
  //       case 200:
  //         return result.data.data
  //       default:
  //         throw new Error('Error fetching')
  //     }
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }
}
