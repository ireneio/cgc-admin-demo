import { authStore, sysStore } from '~/store/'

export function init() {
  const ws = new WebSocket(`${process.env.WS_GAME_URL}/${authStore.info.id}`)

  // @ts-ignore
  ws.onmessage = async (ev) => {
    const parse = JSON.parse(ev.data)
    console.log(parse)
    const { message, data } = parse

    switch (message) {
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

export function sendMessage(ws: WebSocket, message: any) {
  ws.send(JSON.stringify(message))
}
