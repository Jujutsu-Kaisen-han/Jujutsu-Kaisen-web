import type { BaseCharacter } from '../characters/BaseCharacter'
import type { Hitbox } from './Hitbox'

export function calculateDamage(_attacker: BaseCharacter, defender: BaseCharacter, hitbox: Hitbox): number {
  const guarded = defender.isGuarding
  return Math.max(1, Math.round(hitbox.bounds.damage * (guarded ? 0.2 : defender.definition.stats.defense)))
}
