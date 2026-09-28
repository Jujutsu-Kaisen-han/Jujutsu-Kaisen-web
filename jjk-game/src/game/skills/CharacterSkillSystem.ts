import type { BaseCharacter } from '../characters/BaseCharacter'
import type { CombatSystem } from '../combat/CombatSystem'

interface Technique { label: string; energy: number; width: number; damage: number; cooldown: number; duration: number; ranged?: boolean; barrier?: boolean; bypassInfinity?: boolean }

export const GOJO_TECHNIQUES: Technique[] = [
  { label: '술식 순전', energy: 15, width: 420, damage: 22, cooldown: 1900, duration: 300, ranged: true }, { label: '아오', energy: 20, width: 500, damage: 32, cooldown: 3000, duration: 380, ranged: true }, { label: '아카', energy: 22, width: 460, damage: 42, cooldown: 4200, duration: 410, ranged: true }, { label: '무하한', energy: 18, width: 0, damage: 0, cooldown: 6500, duration: 300, barrier: true }, { label: '무라사키', energy: 34, width: 620, damage: 115, cooldown: 9000, duration: 620, ranged: true },
]

const TECHNIQUES: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, Technique[]> = {
  uro: [
    { label: '하늘 왜곡', energy: 12, width: 430, damage: 17, cooldown: 2200, duration: 320, ranged: true }, { label: '공간 굴절', energy: 20, width: 500, damage: 27, cooldown: 4200, duration: 420, ranged: true }, { label: '천역모', energy: 24, width: 145, damage: 26, cooldown: 4000, duration: 430 }, { label: '공간 반전', energy: 17, width: 460, damage: 19, cooldown: 2800, duration: 340, ranged: true }, { label: '우주 단절', energy: 31, width: 560, damage: 38, cooldown: 6800, duration: 560, ranged: true },
  ],
  gojo: GOJO_TECHNIQUES,
  sukuna: [
    { label: '해', energy: 13, width: 460, damage: 20, cooldown: 1600, duration: 300, ranged: true }, { label: '팔', energy: 19, width: 250, damage: 29, cooldown: 3200, duration: 390 }, { label: '참격 난무', energy: 23, width: 520, damage: 34, cooldown: 4000, duration: 460, ranged: true }, { label: '불화', energy: 25, width: 480, damage: 38, cooldown: 4600, duration: 500, ranged: true }, { label: '세계를 가르는 해', energy: 36, width: 650, damage: 90, cooldown: 9000, duration: 640, ranged: true, bypassInfinity: true },
  ],
  yuji: [
    { label: '연속 타격', energy: 10, width: 150, damage: 16, cooldown: 1700, duration: 280 }, { label: '흑섬', energy: 18, width: 175, damage: 30, cooldown: 3400, duration: 340 }, { label: '붕권', energy: 16, width: 190, damage: 24, cooldown: 3000, duration: 330 }, { label: '혼신의 일격', energy: 23, width: 230, damage: 36, cooldown: 4700, duration: 460 }, { label: '흑섬 연쇄', energy: 30, width: 420, damage: 44, cooldown: 6200, duration: 520, ranged: true },
  ],
  megumi: [
    { label: '옥견', energy: 12, width: 430, damage: 18, cooldown: 2200, duration: 340, ranged: true }, { label: '누에', energy: 17, width: 500, damage: 23, cooldown: 3700, duration: 400, ranged: true }, { label: '탈토', energy: 15, width: 460, damage: 17, cooldown: 2800, duration: 330, ranged: true }, { label: '만상', energy: 23, width: 520, damage: 32, cooldown: 4600, duration: 480, ranged: true }, { label: '식신 연성', energy: 32, width: 600, damage: 44, cooldown: 7600, duration: 560, ranged: true },
  ],
}

const REVERSE_LABELS: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, string> = { uro: '반전술식 // 공간 봉합', gojo: '반전술식 // 자가 회복', sukuna: '반전술식 // 재생', yuji: '반전술식 // 육체 회복', megumi: '반전술식 // 그림자 봉합' }

export class CharacterSkillSystem {
  private readonly combat: CombatSystem

  constructor(combat: CombatSystem) { this.combat = combat }

  cast(index: 0 | 1 | 2 | 3 | 4, owner: BaseCharacter, opponent: BaseCharacter, now: number): boolean {
    if (owner.definition.id === 'yuta') return false
    const technique = TECHNIQUES[owner.definition.id][index]
    if (!technique || !owner.canAct(now)) return false
    if (technique.barrier) {
      if (owner.definition.id !== 'gojo' || owner.infinityActive(now) || !owner.spendEnergy(technique.energy) || !owner.activateInfinity(now)) return false
      owner.beginAction(now, 320)
      this.combat.infinityEffect(owner)
      return true
    }
    if (!owner.spendEnergy(technique.energy)) return false
    owner.beginAction(now, technique.duration)
    if (technique.ranged) this.combat.rangedStrike(owner, opponent, technique.width, technique.damage, now, technique.label, undefined, technique.bypassInfinity)
    else this.combat.specialStrike(owner, opponent, technique.width, technique.damage, now, technique.label)
    return true
  }

  cooldown(owner: BaseCharacter, index: 0 | 1 | 2 | 3 | 4): number {
    if (owner.definition.id === 'yuta') return 0
    return TECHNIQUES[owner.definition.id][index]?.cooldown ?? 0
  }

  reverseTechnique(owner: BaseCharacter, now: number): boolean {
    if (owner.definition.id === 'yuta' || !owner.canAct(now) || !owner.spendFixedEnergy(15)) return false
    owner.beginAction(now, 300)
    owner.heal(owner.definition.id === 'gojo' ? 34 : 28)
    this.combat.healEffect(owner, REVERSE_LABELS[owner.definition.id])
    return true
  }
}
