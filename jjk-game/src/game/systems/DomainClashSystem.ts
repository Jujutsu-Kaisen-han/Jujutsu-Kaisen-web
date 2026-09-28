export type DomainClashSlot = 'P1' | 'P2'
export type DomainClashWinner = DomainClashSlot | 'DRAW'

export interface DomainClashSnapshot {
  p1: number
  p2: number
}

export interface DomainClashHitResult {
  snapshot: DomainClashSnapshot
  shift: number
  winner: DomainClashWinner | null
}

const MAX_GAUGE = 100
const INITIAL_GAUGE = 50
const PRESSURE_PER_DAMAGE = 0.8

export class DomainClashSystem {
  private snapshotValue: DomainClashSnapshot = { p1: INITIAL_GAUGE, p2: INITIAL_GAUGE }

  reset(): DomainClashSnapshot {
    this.snapshotValue = { p1: INITIAL_GAUGE, p2: INITIAL_GAUGE }
    return this.snapshot()
  }

  snapshot(): DomainClashSnapshot {
    return { ...this.snapshotValue }
  }

  applyHit(attacker: DomainClashSlot, damage: number): DomainClashHitResult {
    const shift = damage > 0 ? Math.max(1, Math.round(damage * PRESSURE_PER_DAMAGE)) : 0
    const nextP1 = attacker === 'P1' ? this.snapshotValue.p1 + shift : this.snapshotValue.p1 - shift
    const p1 = Math.min(MAX_GAUGE, Math.max(0, nextP1))
    this.snapshotValue = { p1, p2: MAX_GAUGE - p1 }
    return { snapshot: this.snapshot(), shift, winner: this.winner() }
  }

  winner(): DomainClashWinner | null {
    if (this.snapshotValue.p1 >= MAX_GAUGE) return 'P1'
    if (this.snapshotValue.p2 >= MAX_GAUGE) return 'P2'
    return null
  }

  resolve(): DomainClashWinner {
    if (this.snapshotValue.p1 > this.snapshotValue.p2) return 'P1'
    if (this.snapshotValue.p2 > this.snapshotValue.p1) return 'P2'
    return 'DRAW'
  }
}
