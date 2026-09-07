import type { BaseCharacter } from '../characters/BaseCharacter'

export class UltimateSystem {
  isReady(character: BaseCharacter): boolean { return character.ultimate >= 100 }
  consume(character: BaseCharacter): boolean { if (!this.isReady(character)) return false; character.ultimate = 0; return true }
}
