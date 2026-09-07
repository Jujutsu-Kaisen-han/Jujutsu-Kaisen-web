import type { BaseCharacter } from '../characters/BaseCharacter'

export class EnergySystem {
  spend(character: BaseCharacter, amount: number): boolean {
    if (character.energy < amount) return false
    character.energy -= amount
    return true
  }
  recover(character: BaseCharacter, amount: number): void { character.energy = Math.min(character.definition.stats.maxEnergy, character.energy + amount) }
}
