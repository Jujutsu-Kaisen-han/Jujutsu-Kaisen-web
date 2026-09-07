import { useEffect, useRef, type ReactElement } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/config/gameConfig'
import { GameScene } from '../game/scenes/GameScene'
import type { HudState } from '../game/types/gameTypes'

interface GameCanvasProps { onHudUpdate: (state: HudState) => void; onGameOver: () => void; restartToken: number }

export function GameCanvas({ onHudUpdate, onGameOver, restartToken }: GameCanvasProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const callbacksRef = useRef({ onHudUpdate, onGameOver })

  useEffect(() => {
    callbacksRef.current = { onHudUpdate, onGameOver }
  }, [onHudUpdate, onGameOver])

  useEffect(() => {
    if (!hostRef.current) return undefined
    const game = new Phaser.Game({ ...gameConfig, parent: hostRef.current, scene: GameScene })
    gameRef.current = game
    game.events.once('ready', () => {
      const scene = game.scene.getScene(GameScene.key) as unknown as GameScene
      scene.events.on('hud-update', (state: HudState) => callbacksRef.current.onHudUpdate(state))
      scene.events.on('game-over', () => callbacksRef.current.onGameOver())
    })
    return () => { game.destroy(true); gameRef.current = null }
  }, [])

  useEffect(() => {
    if (restartToken === 0 || !gameRef.current) return
    gameRef.current.scene.stop(GameScene.key); gameRef.current.scene.start(GameScene.key)
  }, [restartToken])

  return <div ref={hostRef} id="game-canvas" aria-label="Cursed Blade game canvas" />
}
