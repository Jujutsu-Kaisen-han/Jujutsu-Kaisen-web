import Phaser from 'phaser'
import type { PlayerSlot } from '../types/CharacterTypes'

export interface InputSnapshot { left: boolean; right: boolean; jumpPressed: boolean; guard: boolean; attackPressed: boolean; reversePressed: boolean; strongPressed: boolean; simpleDomainPressed: boolean; skill1Pressed: boolean; skill2Pressed: boolean; skill3Pressed: boolean; skill4Pressed: boolean; skill5Pressed: boolean; ultimatePressed: boolean; dashLeft: boolean; dashRight: boolean; aimX: number | null }

type InputLayout = 'solo' | 'versus'

const bindings = {
  P1: { left: 'A', right: 'D', jump: 'W', guard: 'F', attack: 'F', strong: 'G', simpleDomain: 'G', reverse: 'NINE', skill1: 'E', skill2: 'R', skill3: 'T', skill4: 'Y', skill5: 'U', ultimate: 'H' },
  P2: { left: 'LEFT', right: 'RIGHT', jump: 'UP', guard: 'TWO', attack: 'ONE', strong: 'K', simpleDomain: 'THREE', reverse: 'NINE', skill1: 'FOUR', skill2: 'FIVE', skill3: 'SIX', skill4: 'SEVEN', skill5: 'EIGHT', ultimate: 'L' },
} as const
const soloP1Bindings = bindings.P1

export class InputManager {
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>
  private readonly layout: InputLayout
  private mouseAttackPressed = false
  private mouseReversePressed = false
  private mouseX: number | null = null
  private lastLeftAt = -Infinity
  private lastRightAt = -Infinity
  private readonly slot: PlayerSlot

  constructor(scene: Phaser.Scene, slot: PlayerSlot, layout: InputLayout = 'versus') {
    this.slot = slot
    this.layout = layout
    const keyboard = scene.input.keyboard
    if (!keyboard) throw new Error('Keyboard input is unavailable')
    const map = layout === 'solo' && slot === 'P1' ? soloP1Bindings : bindings[slot]
    this.keys = keyboard.addKeys(`${map.left},${map.right},${map.jump},${map.guard},${map.attack},${map.strong},${map.simpleDomain},${map.reverse},${map.skill1},${map.skill2},${map.skill3},${map.skill4},${map.skill5},${map.ultimate}`) as Record<string, Phaser.Input.Keyboard.Key>
    if (layout === 'solo' && slot === 'P1') {
      scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => { if (pointer.button === 0) this.mouseAttackPressed = true; if (pointer.button === 2) this.mouseReversePressed = true })
      scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => { this.mouseX = pointer.worldX })
      scene.input.mouse?.disableContextMenu()
    }
  }

  read(now: number): InputSnapshot {
    const map = this.layout === 'solo' && this.slot === 'P1' ? soloP1Bindings : bindings[this.slot]
    const leftKey = this.keys[map.left]
    const rightKey = this.keys[map.right]
    const dashLeft = Phaser.Input.Keyboard.JustDown(leftKey) && now - this.lastLeftAt < 260
    const dashRight = Phaser.Input.Keyboard.JustDown(rightKey) && now - this.lastRightAt < 260
    if (leftKey.isDown) this.lastLeftAt = now
    if (rightKey.isDown) this.lastRightAt = now
    const attackPressed = this.layout === 'solo' && this.slot === 'P1' ? this.mouseAttackPressed : Phaser.Input.Keyboard.JustDown(this.keys[map.attack])
    const reversePressed = this.layout === 'solo' && this.slot === 'P1' ? this.mouseReversePressed : Phaser.Input.Keyboard.JustDown(this.keys[map.reverse])
    this.mouseAttackPressed = false; this.mouseReversePressed = false
    const p1Solo = this.layout === 'solo' && this.slot === 'P1'
    return { left: leftKey.isDown, right: rightKey.isDown, jumpPressed: Phaser.Input.Keyboard.JustDown(this.keys[map.jump]), guard: this.keys[map.guard].isDown, attackPressed, reversePressed, strongPressed: p1Solo ? false : Phaser.Input.Keyboard.JustDown(this.keys[map.strong]), simpleDomainPressed: Phaser.Input.Keyboard.JustDown(this.keys[map.simpleDomain]), skill1Pressed: Phaser.Input.Keyboard.JustDown(this.keys[map.skill1]), skill2Pressed: Phaser.Input.Keyboard.JustDown(this.keys[map.skill2]), skill3Pressed: Phaser.Input.Keyboard.JustDown(this.keys[map.skill3]), skill4Pressed: Phaser.Input.Keyboard.JustDown(this.keys[map.skill4]), skill5Pressed: Phaser.Input.Keyboard.JustDown(this.keys[map.skill5]), ultimatePressed: Phaser.Input.Keyboard.JustDown(this.keys[map.ultimate]), dashLeft, dashRight, aimX: p1Solo ? this.mouseX : null }
  }
}
