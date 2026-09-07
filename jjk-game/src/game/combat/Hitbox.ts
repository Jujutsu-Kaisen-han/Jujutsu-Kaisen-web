import type { HitboxData } from '../types/CombatTypes'

export class Hitbox {
  readonly bounds: HitboxData
  constructor(data: HitboxData) { this.bounds = data }
}
