import type { AttackKind } from '../types/CombatTypes'

export class ComboSystem {
  index = 0
  expiresAt = 0
  next(kind: AttackKind, now: number): number {
    if (kind === 'strong' || now > this.expiresAt) this.index = 0
    const current = this.index
    this.index = kind === 'basic' ? (this.index + 1) % 3 : 0
    this.expiresAt = now + 720
    return current
  }
  reset(): void { this.index = 0; this.expiresAt = 0 }
}
