import type { BaseCharacter } from '../characters/BaseCharacter'
import type { InputSnapshot } from './InputManager'

export class AIBrain {
  private nextAttackAt = 0
  private nextDashAt = 0
  private nextSkillAt = 0
  private nextReverseAt = 0
  private skillCursor = 0
  private readonly ai: BaseCharacter
  private readonly target: BaseCharacter

  constructor(ai: BaseCharacter, target: BaseCharacter) { this.ai = ai; this.target = target }

  decide(now: number): InputSnapshot {
    const offsetX = this.target.x - this.ai.x
    const offsetY = this.target.y - this.ai.y
    const distance = Math.hypot(offsetX, offsetY)
    const input: InputSnapshot = { left: false, right: false, up: false, down: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null }
    input.aimX = this.target.x
    const reactionWindow = this.target.attackUntil > now && distance < 185
    const targetFacingAi = this.target.facing === (offsetX >= 0 ? 1 : -1)

    if (reactionWindow && targetFacingAi) {
      input.guard = true
      if (distance < 120 && now >= this.nextDashAt) { if (offsetX >= 0) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 700 }
    } else if (distance > 108) {
      input.right = offsetX > 0; input.left = offsetX < 0; input.down = offsetY > 0; input.up = offsetY < 0
      if (distance > 230 && now >= this.nextDashAt) { if (offsetX > 0) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 700 }
    } else if (distance < 58) {
      input.right = offsetX < 0; input.left = offsetX > 0; input.down = offsetY < 0; input.up = offsetY > 0
    }

    if (now >= this.nextAttackAt && distance < 145 && now >= this.ai.hitstunUntil) {
      if (this.skillCursor % 3 === 0) input.strongPressed = true; else input.attackPressed = true
      this.nextAttackAt = now + 230
    }
    if (this.ai.hp < this.ai.definition.stats.maxHp * 0.52 && now >= this.nextReverseAt) { input.reversePressed = true; this.nextReverseAt = now + 900 }
    if (!this.ai.domainActive(now) && !this.ai.domainBlocked(now) && now >= this.nextSkillAt) { input.ultimatePressed = true; this.nextSkillAt = now + 900 }
    if (this.target.domainActive(now) && !this.ai.domainActive(now) && now >= this.nextSkillAt) { input.simpleDomainPressed = true; this.nextSkillAt = now + 900 }
    const skillRange = this.ai.definition.id === 'yuji' ? 230 : this.ai.definition.id === 'sukuna' ? 560 : 500
    if (now >= this.nextSkillAt && distance < skillRange && now >= this.ai.hitstunUntil) {
      const skill = this.skillCursor % 5
      if (skill === 0) input.skill1Pressed = true
      if (skill === 1) input.skill2Pressed = true
      if (skill === 2) input.skill3Pressed = true
      if (skill === 3) input.skill4Pressed = true
      if (skill === 4) input.skill5Pressed = true
      this.skillCursor += 1
      this.nextSkillAt = now + 520
    }
    return input
  }

  reset(now: number): void { this.nextAttackAt = now + 350; this.nextDashAt = now; this.nextSkillAt = now + 600; this.nextReverseAt = now + 500; this.skillCursor = 0 }
}
