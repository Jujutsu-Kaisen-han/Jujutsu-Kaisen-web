import type { BaseCharacter } from '../characters/BaseCharacter'
import type { CombatSystem } from '../combat/CombatSystem'

interface Technique { label: string; energy: number; width: number; damage: number; ranged?: boolean; barrier?: boolean; nearDeath?: boolean }

const TECHNIQUES: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, Technique[]> = {
  uro: [
    { label: '하늘 왜곡', energy: 14, width: 430, damage: 18, ranged: true }, { label: '공간 굴절', energy: 18, width: 500, damage: 24, ranged: true }, { label: '천역모', energy: 22, width: 145, damage: 30 }, { label: '공간 반전', energy: 16, width: 460, damage: 20, ranged: true }, { label: '우주 단절', energy: 30, width: 560, damage: 36, ranged: true },
  ],
  gojo: [
    { label: '술식 순전', energy: 15, width: 420, damage: 20, ranged: true }, { label: '아오', energy: 20, width: 500, damage: 28, ranged: true }, { label: '아카', energy: 22, width: 460, damage: 32, ranged: true }, { label: '무하한', energy: 18, width: 0, damage: 0, barrier: true }, { label: '무라사키', energy: 34, width: 620, damage: 42, ranged: true, nearDeath: true },
  ],
  sukuna: [
    { label: '해', energy: 13, width: 460, damage: 22, ranged: true }, { label: '팔', energy: 18, width: 250, damage: 28 }, { label: '참격 난무', energy: 22, width: 520, damage: 34, ranged: true }, { label: '불화', energy: 24, width: 480, damage: 38, ranged: true }, { label: '세계 참격', energy: 36, width: 650, damage: 48, ranged: true },
  ],
  yuji: [
    { label: '연속 타격', energy: 10, width: 150, damage: 18 }, { label: '흑섬', energy: 18, width: 175, damage: 30 }, { label: '붕권', energy: 16, width: 190, damage: 25 }, { label: '혼신의 일격', energy: 23, width: 230, damage: 36 }, { label: '흑섬 연쇄', energy: 30, width: 420, damage: 44, ranged: true },
  ],
  megumi: [
    { label: '옥견', energy: 12, width: 430, damage: 19, ranged: true }, { label: '누에', energy: 17, width: 500, damage: 24, ranged: true }, { label: '탈토', energy: 15, width: 460, damage: 18, ranged: true }, { label: '만상', energy: 23, width: 520, damage: 34, ranged: true }, { label: '식신 연성', energy: 32, width: 600, damage: 42, ranged: true },
  ],
}

const REVERSE_LABELS: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, string> = { uro: '반전술식 // 공간 봉합', gojo: '반전술식 // 자가 회복', sukuna: '반전술식 // 재생', yuji: '반전술식 // 육체 회복', megumi: '반전술식 // 그림자 봉합' }

export class CharacterSkillSystem {
  private readonly combat: CombatSystem

  constructor(combat: CombatSystem) { this.combat = combat }

  cast(index: 0 | 1 | 2 | 3 | 4, owner: BaseCharacter, opponent: BaseCharacter, now: number): boolean {
    if (owner.definition.id === 'yuta') return false
    const technique = TECHNIQUES[owner.definition.id][index]
    if (!technique) return false
    if (technique.barrier) {
      if (owner.definition.id !== 'gojo' || owner.infinityActive(now) || !owner.spendEnergy(technique.energy) || !owner.activateInfinity(now)) return false
      this.combat.infinityEffect(owner)
      return true
    }
    if (!owner.spendEnergy(technique.energy)) return false
    if (technique.ranged) this.combat.rangedStrike(owner, opponent, technique.width, technique.damage, now, technique.label, technique.nearDeath ? (target) => Math.max(1, target.hp - Math.max(1, Math.round(target.definition.stats.maxHp * 0.08))) : undefined)
    else this.combat.specialStrike(owner, opponent, technique.width, technique.damage, now, technique.label)
    return true
  }

  reverseTechnique(owner: BaseCharacter): boolean {
    if (owner.definition.id === 'yuta' || !owner.spendFixedEnergy(15)) return false
    owner.heal(owner.definition.id === 'gojo' ? 34 : 28)
    this.combat.healEffect(owner, REVERSE_LABELS[owner.definition.id])
    return true
  }
}
