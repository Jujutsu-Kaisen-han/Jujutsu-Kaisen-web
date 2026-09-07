import type { CharacterId, PlayerSlot } from '../types/CharacterTypes'
import type { InputSnapshot } from '../systems/InputManager'

export interface OnlineMatch {
  matchId: string
  role: PlayerSlot
  p1: CharacterId
  p2: CharacterId
}

type StatusListener = (status: string) => void

const emptyInput = (): InputSnapshot => ({ left: false, right: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null })
const socketUrl = (): string => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const port = window.location.port === '5173' ? ':3001' : ''
  return `${protocol}//${window.location.hostname}${port}`
}

export class OnlineClient {
  private socket?: WebSocket
  private remoteInput = emptyInput()
  private readonly onStatus: StatusListener

  constructor(onStatus: StatusListener = () => undefined) { this.onStatus = onStatus }

  findMatch(character: CharacterId): Promise<OnlineMatch> {
    return new Promise((resolve, reject) => {
      let settled = false
      const socket = new WebSocket(socketUrl())
      this.socket = socket
      const timeout = window.setTimeout(() => { if (!settled) { settled = true; socket.close(); reject(new Error('매칭 시간이 초과됐어')) } }, 30000)
      socket.addEventListener('open', () => { this.onStatus('MATCHMAKING // SEARCHING'); socket.send(JSON.stringify({ type: 'queue', character })) })
      socket.addEventListener('message', (event) => {
        let message: unknown
        try { message = JSON.parse(String(event.data)) } catch { return }
        if (!message || typeof message !== 'object' || !('type' in message)) return
        const data = message as { type: string; matchId?: string; role?: PlayerSlot; p1?: CharacterId; p2?: CharacterId; input?: InputSnapshot; status?: string }
        if (data.type === 'status') { this.onStatus(data.status ?? 'MATCHMAKING'); return }
        if (data.type === 'match-found' && data.matchId && data.role && data.p1 && data.p2) {
          window.clearTimeout(timeout); settled = true; this.onStatus('MATCH FOUND // CONNECTED'); resolve({ matchId: data.matchId, role: data.role, p1: data.p1, p2: data.p2 }); return
        }
        if (data.type === 'input' && data.input) this.remoteInput = data.input
        if (data.type === 'opponent-left') this.onStatus('OPPONENT DISCONNECTED')
      })
      socket.addEventListener('error', () => { if (!settled) { window.clearTimeout(timeout); settled = true; reject(new Error('매칭 서버에 연결할 수 없어')) } })
      socket.addEventListener('close', () => { if (!settled) { window.clearTimeout(timeout); settled = true; reject(new Error('매칭 서버 연결이 종료됐어')) } })
    })
  }

  sendInput(input: InputSnapshot): void { if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify({ type: 'input', input })) }

  consumeRemoteInput(): InputSnapshot {
    const current = this.remoteInput
    this.remoteInput = { ...current, jumpPressed: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false }
    return current
  }

  close(): void { this.socket?.close(); this.socket = undefined }
}
