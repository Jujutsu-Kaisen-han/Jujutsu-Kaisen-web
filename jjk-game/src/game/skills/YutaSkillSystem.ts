import type { BaseCharacter } from '../characters/BaseCharacter'
import type { CombatSystem } from '../combat/CombatSystem'

export type YutaCopiedSkill = '주언' | '우수나타' | '스쿠나참격' | '야곱의 사다리'
export const YUTA_COPIED_SKILLS: YutaCopiedSkill[] = ['주언', '우수나타', '스쿠나참격', '야곱의 사다리']

export class YutaSkillSystem {
  private readonly combat: CombatSystem
  constructor(combat: CombatSystem) { this.combat = combat }

  cast(index: 0 | 1 | 2 | 3 | 4, owner: BaseCharacter, opponent: BaseCharacter, now: number): YutaCopiedSkill | '완전현현' | '리카 공격' | null {
    if (owner.definition.id !== 'yuta') return null
    if (index === 0 && owner.spendEnergy(16)) { this.combat.rikaAttack(owner, opponent, now); return '리카 공격' }
    if (index === 1 && !owner.fullManifestActive(now) && owner.activateFullManifest(now)) { this.combat.manifestEffect(owner); return '완전현현' }
    if (index >= 2 && owner.fullManifestActive(now)) return this.useRandomCopy(owner, opponent, now)
    return null
  }

  reverseTechnique(owner: BaseCharacter): boolean { if (owner.definition.id !== 'yuta' || !owner.spendEnergyPercent(0.42)) return false; owner.heal(28); this.combat.healEffect(owner); return true }

  useRandomCopy(owner: BaseCharacter, opponent: BaseCharacter, now: number): YutaCopiedSkill | null {
    if (!owner.fullManifestActive(now)) return null
    const copied = YUTA_COPIED_SKILLS[Math.floor(Math.random() * YUTA_COPIED_SKILLS.length)]
    if (copied === '주언') { opponent.hitstunUntil = Math.max(opponent.hitstunUntil, now + 650); this.combat.copiedTechniqueEffect(owner, opponent, copied) }
    if (copied === '우수나타') this.combat.specialStrike(owner, opponent, 180, 20, now, copied)
    if (copied === '스쿠나참격') this.combat.specialStrike(owner, opponent, 250, 28, now, copied)
    if (copied === '야곱의 사다리') this.combat.guaranteedStrike(owner, opponent, 25, now, copied)
    return copied
  }
}
