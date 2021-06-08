/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '~/store/auth'
import SysModule from '~/store/sys'
import UserModule from '~/store/user'
import TransactionModule from '~/store/transaction'
import RuleModule from '~/store/rule'
import ErrorModule from '~/store/error'
import ChatModule from '~/store/chat'

let authStore: AuthModule
let sysStore: SysModule
let userStore: UserModule
let transactionStore: TransactionModule
let ruleStore: RuleModule
let errorStore: ErrorModule
let chatStore: ChatModule

function initialiseStores(store: Store<any>): void {
  authStore = getModule(AuthModule, store)
  sysStore = getModule(SysModule, store)
  userStore = getModule(UserModule, store)
  transactionStore = getModule(TransactionModule, store)
  ruleStore = getModule(RuleModule, store)
  errorStore = getModule(ErrorModule, store)
  chatStore = getModule(ChatModule, store)
}

export {
  initialiseStores,
  authStore,
  sysStore,
  userStore,
  transactionStore,
  ruleStore,
  errorStore,
  chatStore
}
