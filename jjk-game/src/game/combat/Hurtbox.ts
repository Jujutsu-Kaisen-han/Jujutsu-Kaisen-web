import type { HurtboxData } from '../types/CombatTypes'

export class Hurtbox {
  readonly bounds: HurtboxData = { x: 0, y: 0, width: 42, height: 96 }
  update(x: number, y: number): void { this.bounds.x = x - this.bounds.width / 2; this.bounds.y = y - this.bounds.height }
}
