import { sysStore } from '~/store/'

export function init() {
  const ws = new WebSocket(`ws://localhost:8081/ws/game`)

  // @ts-ignore
  ws.onmessage = (ev) => {
    const parse = JSON.parse(ev.data)
    console.log(parse)
    const { message, data } = parse
    switch (message) {
      case 'player-bet-disallow':
        onPlayerBetDisallow(data)
        break
      case 'player-bet-allow':
        onPlayerBetAllow(data)
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

function onPlayerBetDisallow(data: any) {
  sysStore.setPlayerBetAllow(false)
  if (Object.keys(data).length) {
    sysStore.setGameInfo(data)
  }
}

function onPlayerBetAllow(data: any) {
  sysStore.setPlayerBetAllow(true)
  if (Object.keys(data).length) {
    sysStore.setGameInfo(data)
  }
}
