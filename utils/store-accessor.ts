/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '~/store/auth'
import SysModule from '~/store/sys'
import UserModule from '~/store/user'
import TransactionModule from '~/store/transaction'
import ErrorModule from '~/store/error'

let authStore: AuthModule
let sysStore: SysModule
let userStore: UserModule
let transactionStore: TransactionModule
let errorStore: ErrorModule

function initialiseStores(store: Store<any>): void {
  authStore = getModule(AuthModule, store)
  sysStore = getModule(SysModule, store)
  userStore = getModule(UserModule, store)
  transactionStore = getModule(TransactionModule, store)
  errorStore = getModule(ErrorModule, store)
}

export {
  initialiseStores,
  authStore,
  sysStore,
  userStore,
  transactionStore,
  errorStore,
}
