import { authStore, chatStore, sysStore } from '~/store/'

export function init() {
  const ws = new WebSocket(`${process.env.WS_GAME_URL}/${authStore.info.id}`)

  // @ts-ignore
  ws.onmessage = async (ev) => {
    const parse = JSON.parse(ev.data)
    // console.log(parse)
    const { message, data } = parse

    switch (message) {
      case 'is-applied-host':
      case 'host-apply-list':
        sysStore.setHostApplyList(data.hostApplyList)
        break
      case 'round-host-bet':
        await sysStore.getConfig()
        break
    }
  }

  ws.onerror = () => {
    init()
  }

  return ws
}

export function initChat() {
  const wsChat = new WebSocket(`${process.env.WS_CHAT_URL}`)

  wsChat.onmessage = (ev) => {
    const parse = JSON.parse(ev.data)
    // console.log(parse)
    const { message, data } = parse

    switch (message) {
      case 'chat-message':
        chatStore.setmessageList(data.list)
        break
      case 'chat-init':
        chatStore.setmessageList(data.list)
        break
    }
  }

  wsChat.onerror = () => {
    init()
  }

  return wsChat
}

export function sendMessage(ws: WebSocket, message: any) {
  ws.send(JSON.stringify(message))
}
