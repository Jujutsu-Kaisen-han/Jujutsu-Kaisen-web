import { useEffect, useRef, type ReactElement } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config/gameConfig'
import { BattleScene, type BattleInitData } from '../game/scenes/BattleScene'
import { OnlineClient } from '../game/network/OnlineClient'
import type { BattleHudState } from '../game/types/CombatTypes'

interface MatchResult { winner: 'P1' | 'P2'; p1Rounds: number; p2Rounds: number }
interface GameCanvasProps { selection: BattleInitData; onHudUpdate: (state: BattleHudState) => void; onMatchOver: (result: MatchResult) => void; onNetworkStatus?: (status: string) => void }

export function GameCanvas({ selection, onHudUpdate, onMatchOver, onNetworkStatus = () => undefined }: GameCanvasProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null); const callbacksRef = useRef({ onHudUpdate, onMatchOver, onNetworkStatus })
  useEffect(() => { callbacksRef.current = { onHudUpdate, onMatchOver, onNetworkStatus } }, [onHudUpdate, onMatchOver, onNetworkStatus])
  useEffect(() => {
    if (!hostRef.current) return undefined
    let disposed = false
    let game: Phaser.Game | undefined
    let onlineClient: OnlineClient | undefined
    const launch = async (): Promise<void> => {
      let matchSelection = selection
      if (selection.mode === 'online') {
        callbacksRef.current.onNetworkStatus('MATCHMAKING // CONNECTING')
        onlineClient = new OnlineClient((status) => callbacksRef.current.onNetworkStatus(status))
        try {
          const match = await onlineClient.findMatch(selection.p1)
          if (disposed) return
          matchSelection = { p1: match.p1, p2: match.p2, mode: 'online', onlineRole: match.role, onlineClient }
        } catch (error) {
          if (!disposed) callbacksRef.current.onNetworkStatus(error instanceof Error ? error.message : 'MATCHMAKING ERROR')
          return
        }
      }
      if (disposed || !hostRef.current) return
      game = new Phaser.Game({ ...gameConfig, parent: hostRef.current, scene: BattleScene })
      const handleReady = () => {
        if (disposed || !game) return
        const scene = game.scene.getScene(BattleScene.key) as unknown as BattleScene
        scene.events.on('hud-update', (state: BattleHudState) => callbacksRef.current.onHudUpdate(state))
        scene.events.once('match-over', (result: MatchResult) => callbacksRef.current.onMatchOver(result))
        scene.scene.restart(matchSelection)
      }
      game.events.once('ready', handleReady)
    }
    void launch()
    return () => { disposed = true; onlineClient?.close(); game?.destroy(true) }
  }, [selection])
  return <div ref={hostRef} id="game-canvas" aria-label="Online 1 versus 1 battle arena" />
}
