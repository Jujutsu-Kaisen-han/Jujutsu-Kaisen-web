import type { BaseCharacter } from '../characters/BaseCharacter'
import type { InputSnapshot } from './InputManager'

export class AIBrain {
  private nextAttackAt = 0
  private nextJumpAt = 0
  private nextDashAt = 0
  private nextSkillAt = 0
  private nextReverseAt = 0
  private skillCursor = 0
  private readonly ai: BaseCharacter
  private readonly target: BaseCharacter

  constructor(ai: BaseCharacter, target: BaseCharacter) { this.ai = ai; this.target = target }

  decide(now: number): InputSnapshot {
    const distance = Math.abs(this.target.x - this.ai.x)
    const targetToAi = this.ai.x - this.target.x
    const input: InputSnapshot = { left: false, right: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null }
    input.aimX = this.target.x
    const reactionWindow = this.target.attackUntil > now && distance < 185
    const targetFacingAi = this.target.facing === (targetToAi >= 0 ? 1 : -1)

    if (reactionWindow && targetFacingAi) {
      input.guard = true
      if (distance < 120 && now >= this.nextDashAt) { if (targetToAi >= 0) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 700 }
    } else if (distance > 108) {
      if (this.target.x > this.ai.x) input.right = true; else input.left = true
      if (distance > 230 && now >= this.nextDashAt) { if (this.target.x > this.ai.x) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 700 }
    } else if (distance < 58) {
      if (this.target.x > this.ai.x) input.left = true; else input.right = true
    }

    if (this.target.velocityY < -100 && distance < 170 && now >= this.nextJumpAt) { input.jumpPressed = true; this.nextJumpAt = now + 900 }
    if (now >= this.nextAttackAt && distance < 145 && this.ai.isGrounded && now >= this.ai.hitstunUntil) {
      if (this.skillCursor % 3 === 0) input.strongPressed = true; else input.attackPressed = true
      this.nextAttackAt = now + 230
    }
    if (this.ai.hp < this.ai.definition.stats.maxHp * 0.52 && now >= this.nextReverseAt) { input.reversePressed = true; this.nextReverseAt = now + 900 }
    if (this.ai.ultimate >= 100 && !this.ai.domainActive(now) && now >= this.nextSkillAt) { input.ultimatePressed = true; this.nextSkillAt = now + 900 }
    if (this.target.domainActive(now) && !this.ai.domainActive(now) && now >= this.nextSkillAt) { input.simpleDomainPressed = true; this.nextSkillAt = now + 900 }
    if (now >= this.nextSkillAt && distance < 330 && now >= this.ai.hitstunUntil) {
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

  reset(now: number): void { this.nextAttackAt = now + 350; this.nextJumpAt = now; this.nextDashAt = now; this.nextSkillAt = now + 600; this.nextReverseAt = now + 500; this.skillCursor = 0 }
}
