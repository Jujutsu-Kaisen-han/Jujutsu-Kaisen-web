import type { BaseCharacter } from '../characters/BaseCharacter'
import type { CombatSystem } from '../combat/CombatSystem'

interface Technique { label: string; energy: number; width: number; damage: number }

const TECHNIQUES: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, Technique[]> = {
  uro: [
    { label: '하늘 왜곡', energy: 14, width: 190, damage: 18 }, { label: '공간 굴절', energy: 18, width: 240, damage: 24 }, { label: '천역모', energy: 22, width: 145, damage: 30 }, { label: '공간 반전', energy: 16, width: 280, damage: 20 }, { label: '우주 단절', energy: 30, width: 330, damage: 36 },
  ],
  gojo: [
    { label: '술식 순전', energy: 15, width: 180, damage: 20 }, { label: '아오', energy: 20, width: 250, damage: 28 }, { label: '아카', energy: 22, width: 170, damage: 32 }, { label: '무하한', energy: 18, width: 300, damage: 22 }, { label: '허식 자', energy: 34, width: 380, damage: 42 },
  ],
  sukuna: [
    { label: '해', energy: 13, width: 210, damage: 22 }, { label: '팔', energy: 18, width: 250, damage: 28 }, { label: '참격 난무', energy: 22, width: 300, damage: 34 }, { label: '불화', energy: 24, width: 220, damage: 38 }, { label: '세계 참격', energy: 36, width: 410, damage: 48 },
  ],
  yuji: [
    { label: '연속 타격', energy: 10, width: 150, damage: 18 }, { label: '흑섬', energy: 18, width: 175, damage: 30 }, { label: '붕권', energy: 16, width: 190, damage: 25 }, { label: '혼신의 일격', energy: 23, width: 230, damage: 36 }, { label: '흑섬 연쇄', energy: 30, width: 270, damage: 44 },
  ],
  megumi: [
    { label: '옥견', energy: 12, width: 190, damage: 19 }, { label: '누에', energy: 17, width: 250, damage: 24 }, { label: '탈토', energy: 15, width: 300, damage: 18 }, { label: '만상', energy: 23, width: 260, damage: 34 }, { label: '식신 연성', energy: 32, width: 360, damage: 42 },
  ],
}

const REVERSE_LABELS: Record<Exclude<BaseCharacter['definition']['id'], 'yuta'>, string> = { uro: '반전술식 // 공간 봉합', gojo: '반전술식 // 자가 회복', sukuna: '반전술식 // 재생', yuji: '반전술식 // 육체 회복', megumi: '반전술식 // 그림자 봉합' }

export class CharacterSkillSystem {
  private readonly combat: CombatSystem

  constructor(combat: CombatSystem) { this.combat = combat }

  cast(index: 0 | 1 | 2 | 3 | 4, owner: BaseCharacter, opponent: BaseCharacter, now: number): boolean {
    if (owner.definition.id === 'yuta') return false
    const technique = TECHNIQUES[owner.definition.id][index]
    if (!technique || !owner.spendEnergy(technique.energy)) return false
    this.combat.specialStrike(owner, opponent, technique.width, technique.damage, now, technique.label)
    return true
  }

  reverseTechnique(owner: BaseCharacter): boolean {
    if (owner.definition.id === 'yuta' || !owner.spendEnergy(30)) return false
    owner.heal(owner.definition.id === 'gojo' ? 34 : 28)
    this.combat.healEffect(owner, REVERSE_LABELS[owner.definition.id])
    return true
  }
}
