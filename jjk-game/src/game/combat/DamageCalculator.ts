import type { BaseCharacter } from '../characters/BaseCharacter'
import type { Hitbox } from './Hitbox'

export function calculateDamage(attacker: BaseCharacter, defender: BaseCharacter, hitbox: Hitbox): number {
  const guarded = defender.isGuarding
  const aiDamageBoost = attacker.aiControlled ? 1.45 : 1
  const aiDamageReduction = defender.aiControlled ? 0.72 : 1
  return Math.max(1, Math.round(hitbox.bounds.damage * aiDamageBoost * (guarded ? 0.2 : defender.definition.stats.defense) * aiDamageReduction))
}
