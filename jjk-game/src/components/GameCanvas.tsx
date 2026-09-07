import { useEffect, useRef, type ReactElement } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config/gameConfig'
import { BattleScene, type BattleInitData } from '../game/scenes/BattleScene'
import type { BattleHudState } from '../game/types/CombatTypes'

interface MatchResult { winner: 'P1' | 'P2'; p1Rounds: number; p2Rounds: number }
interface GameCanvasProps { selection: BattleInitData; onHudUpdate: (state: BattleHudState) => void; onMatchOver: (result: MatchResult) => void }

export function GameCanvas({ selection, onHudUpdate, onMatchOver }: GameCanvasProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null); const callbacksRef = useRef({ onHudUpdate, onMatchOver })
  useEffect(() => { callbacksRef.current = { onHudUpdate, onMatchOver } }, [onHudUpdate, onMatchOver])
  useEffect(() => {
    if (!hostRef.current) return undefined
    let disposed = false
    const game = new Phaser.Game({ ...gameConfig, parent: hostRef.current, scene: BattleScene })
    const handleReady = () => {
      if (disposed) return
      const scene = game.scene.getScene(BattleScene.key) as unknown as BattleScene
      scene.events.on('hud-update', (state: BattleHudState) => callbacksRef.current.onHudUpdate(state))
      scene.events.once('match-over', (result: MatchResult) => callbacksRef.current.onMatchOver(result))
      scene.scene.restart(selection)
    }
    game.events.once('ready', handleReady)
    return () => { disposed = true; game.events.off('ready', handleReady); game.destroy(true) }
  }, [selection])
  return <div ref={hostRef} id="game-canvas" aria-label="Local 1 versus 1 battle arena" />
}
