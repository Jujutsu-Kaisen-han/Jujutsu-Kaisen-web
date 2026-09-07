import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { WebSocketServer } from 'ws'

const port = Number(process.env.PORT ?? 3001)
const distRoot = resolve(process.cwd(), 'dist')
const characters = new Set(['yuta', 'uro', 'gojo', 'sukuna', 'yuji', 'megumi'])
const waiting = []
const rooms = new Map()
let nextMatchId = 1

const send = (client, message) => { if (client.readyState === 1) client.send(JSON.stringify(message)) }
const removeWaiting = (client) => { const index = waiting.indexOf(client); if (index >= 0) waiting.splice(index, 1) }
const tryMatch = () => {
  while (waiting.length >= 2) {
    const first = waiting.shift(); const second = waiting.shift(); const matchId = `match-${nextMatchId++}`
    const room = { id: matchId, players: [first, second] }; rooms.set(matchId, room)
    first.room = room; first.role = 'P1'; second.room = room; second.role = 'P2'
    send(first, { type: 'match-found', matchId, role: 'P1', p1: first.character, p2: second.character })
    send(second, { type: 'match-found', matchId, role: 'P2', p1: first.character, p2: second.character })
  }
}

const handleMessage = (client, message) => {
  if (!message || typeof message !== 'object' || typeof message.type !== 'string') return
  if (message.type === 'queue' && !client.room && !waiting.includes(client)) {
    if (!characters.has(message.character)) return send(client, { type: 'error', message: '알 수 없는 캐릭터야' })
    client.character = message.character; waiting.push(client); send(client, { type: 'status', status: 'MATCHMAKING // WAITING' }); tryMatch(); return
  }
  if (message.type === 'input' && client.room) {
    client.room.players.filter((player) => player !== client).forEach((player) => send(player, { type: 'input', from: client.role, input: message.input }))
  }
}

const cleanup = (client) => {
  removeWaiting(client)
  if (!client.room) return
  const room = client.room; rooms.delete(room.id); room.players.filter((player) => player !== client).forEach((player) => { player.room = undefined; send(player, { type: 'opponent-left' }) }); client.room = undefined
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }
const httpServer = createServer((request, response) => {
  if (request.url === '/health') { response.writeHead(200, { 'content-type': 'application/json' }); response.end(JSON.stringify({ ok: true, waiting: waiting.length, matches: rooms.size })); return }
  if (!existsSync(distRoot)) { response.writeHead(503); response.end('Run npm run build first.'); return }
  const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
  const candidate = resolve(distRoot, `.${normalize(requestPath)}`)
  const filePath = candidate.startsWith(distRoot) && existsSync(candidate) && statSync(candidate).isFile() ? candidate : join(distRoot, 'index.html')
  response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' }); createReadStream(filePath).pipe(response)
})

const webSocketServer = new WebSocketServer({ server: httpServer })
webSocketServer.on('connection', (client) => {
  client.on('message', (raw) => { try { handleMessage(client, JSON.parse(String(raw))) } catch { send(client, { type: 'error', message: '잘못된 요청이야' }) } })
  client.on('close', () => cleanup(client)); client.on('error', () => cleanup(client))
})

httpServer.listen(port, () => { console.log(`JJK online server listening on http://localhost:${port}`) })
