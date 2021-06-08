import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'chat',
  stateFactory: true,
  namespaced: true
})
export default class ChatModule extends VuexModule {
  private _messageList: any[] = []

  public get messageList(): any[] {
    return this._messageList
  }

  @Mutation
  public setmessageList(payload: any[]) {
    this._messageList = [...payload]
  }
}
