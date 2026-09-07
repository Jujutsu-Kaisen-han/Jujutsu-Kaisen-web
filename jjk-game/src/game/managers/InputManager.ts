import Phaser from 'phaser'
import type { Vector2 } from '../types/gameTypes'

export class InputManager {
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>
  private readonly scene: Phaser.Scene
  private attackPressed = false
  private pointer: Vector2 = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const keyboard = scene.input.keyboard
    if (!keyboard) throw new Error('Keyboard input is unavailable')
    this.keys = keyboard.addKeys('W,A,S,D,SPACE,Q,E,R,F') as Record<string, Phaser.Input.Keyboard.Key>
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => { if (pointer.leftButtonDown()) this.attackPressed = true })
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => { this.pointer = { x: pointer.worldX, y: pointer.worldY } })
    scene.input.mouse?.disableContextMenu()
  }

  update(): void {
    const pointer = this.scene.input.activePointer
    this.pointer = { x: pointer.worldX, y: pointer.worldY }
  }

  get movement(): Vector2 {
    return { x: Number(this.keys.A.isDown) * -1 + Number(this.keys.D.isDown), y: Number(this.keys.W.isDown) * -1 + Number(this.keys.S.isDown) }
  }

  get pointerWorld(): Vector2 { return this.pointer }
  consumeAttack(): boolean { const pressed = this.attackPressed; this.attackPressed = false; return pressed }
  consumeSkill(key: 'SPACE' | 'Q' | 'E' | 'R' | 'F'): boolean { return Phaser.Input.Keyboard.JustDown(this.keys[key]) }
}
