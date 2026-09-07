import type { BaseCharacter } from '../characters/BaseCharacter'
import type { InputSnapshot } from './InputManager'

export class AIBrain {
  private nextAttackAt = 0
  private nextDecisionAt = 0
  private nextJumpAt = 0
  private nextDashAt = 0
  private nextSkillAt = 0
  private readonly ai: BaseCharacter
  private readonly target: BaseCharacter

  constructor(ai: BaseCharacter, target: BaseCharacter) { this.ai = ai; this.target = target }

  decide(now: number): InputSnapshot {
    const distance = Math.abs(this.target.x - this.ai.x)
    const targetToAi = this.ai.x - this.target.x
    const input: InputSnapshot = { left: false, right: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null }
    const reactionWindow = this.target.attackUntil > now && distance < 185
    const targetFacingAi = this.target.facing === (targetToAi >= 0 ? 1 : -1)

    if (reactionWindow && targetFacingAi) {
      if (now >= this.nextDecisionAt) { input.guard = true; this.nextDecisionAt = now + 140 }
      if (distance < 92 && now >= this.nextDashAt && Math.random() > 0.36) { if (targetToAi >= 0) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 900 }
    } else if (distance > 108) {
      if (this.target.x > this.ai.x) input.right = true; else input.left = true
      if (distance > 250 && now >= this.nextDashAt) { if (this.target.x > this.ai.x) input.dashRight = true; else input.dashLeft = true; this.nextDashAt = now + 850 }
    } else if (distance < 58) {
      if (now >= this.nextDecisionAt) { if (this.target.x > this.ai.x) input.left = true; else input.right = true; this.nextDecisionAt = now + 170 }
    }

    if (!this.ai.isGrounded && this.target.isGrounded && now >= this.nextJumpAt) { input.jumpPressed = true; this.nextJumpAt = now + 1200 }
    if (this.target.velocityY < -100 && distance < 130 && now >= this.nextJumpAt) { input.jumpPressed = true; this.nextJumpAt = now + 1200 }
    if (now >= this.nextAttackAt && distance < 118 && this.ai.isGrounded && now >= this.ai.hitstunUntil) {
      if (Math.random() > 0.7) input.strongPressed = true; else input.attackPressed = true
      this.nextAttackAt = now + (Math.random() > 0.55 ? 280 : 520)
    }
    if (this.ai.ultimate >= 100 && !this.ai.domainActive(now) && now >= this.nextSkillAt) { input.ultimatePressed = true; this.nextSkillAt = now + 800 }
    if (this.ai.definition.id === 'yuta' && now >= this.nextSkillAt && distance < 210) { input.skill1Pressed = true; this.nextSkillAt = now + 1800 }
    return input
  }

  reset(now: number): void { this.nextAttackAt = now + 600; this.nextDecisionAt = now; this.nextJumpAt = now; this.nextDashAt = now; this.nextSkillAt = now + 900 }
}
