import Phaser from 'phaser'
import { CHARACTER_DEFINITIONS, type CharacterDefinition, type CharacterId, type PlayerSlot } from '../types/CharacterTypes'
import { Hitbox } from '../combat/Hitbox'
import { Hurtbox } from '../combat/Hurtbox'
import { ComboSystem } from '../combat/ComboSystem'
import type { AttackKind } from '../types/CombatTypes'
import type { InputSnapshot } from '../systems/InputManager'
import { attackMotionPhase, clamp01, damp, easeInOutSine, easeOutBack, easeOutCubic } from '../animation/MotionMath'

export class BaseCharacter extends Phaser.GameObjects.Container {
  readonly definition: CharacterDefinition
  readonly slot: PlayerSlot
  readonly hurtbox = new Hurtbox()
  readonly combo = new ComboSystem()
  hp: number
  energy: number
  ultimate = 0
  domainUntil = 0
  domainBlockedUntil = 0
  simpleDomainUntil = 0
  fullManifestUntil = 0
  fullManifestUsed = false
  infinityUntil = 0
  private unlimitedEnergy = false
  aiControlled = false
  mahoragaSummoned = false
  adaptedTechnique: string | null = null
  readonly energyCostMultiplier: number
  isGuarding = false
  isGrounded = true
  facing: 1 | -1
  hitstunUntil = 0
  immobilizedUntil = 0
  invulnerableUntil = 0
  attackUntil = 0
  velocityX = 0
  velocityY = 0
  private readonly bodyGraphic: Phaser.GameObjects.Graphics
  private readonly auraGraphic: Phaser.GameObjects.Graphics
  private readonly signatureGraphic: Phaser.GameObjects.Graphics
  private readonly motionGraphic: Phaser.GameObjects.Graphics
  private readonly impactGraphic: Phaser.GameObjects.Graphics
  private readonly nameTag: Phaser.GameObjects.Text
  private dashUntil = 0
  private dashStartedAt = 0
  private landingUntil = 0
  private recoilUntil = 0
  private recoilDirection = 0
  private wasGrounded = true
  private attackStartedAt = 0
  private attackDuration = 0

  constructor(scene: Phaser.Scene, id: CharacterId, slot: PlayerSlot, x: number, y: number, facing: 1 | -1) {
    super(scene, x, y)
    this.definition = CHARACTER_DEFINITIONS[id]; this.slot = slot; this.facing = facing; this.energyCostMultiplier = id === 'gojo' ? 0.05 : id === 'sukuna' ? 0.65 : 1
    this.hp = this.definition.stats.maxHp; this.energy = this.definition.stats.maxEnergy
    this.bodyGraphic = scene.add.graphics(); this.auraGraphic = scene.add.graphics(); this.signatureGraphic = scene.add.graphics(); this.motionGraphic = scene.add.graphics(); this.impactGraphic = scene.add.graphics()
    this.drawBody()
    this.nameTag = scene.add.text(0, -62, this.definition.name, { color: '#f5fbff', fontFamily: 'Space Mono, monospace', fontSize: '9px', fontStyle: 'bold', stroke: '#07111f', strokeThickness: 3 }).setOrigin(0.5)
    this.add([this.auraGraphic, this.motionGraphic, this.bodyGraphic, this.signatureGraphic, this.impactGraphic, this.nameTag]); this.setSize(76, 92); this.setDepth(y); this.setScale(facing, 1); this.nameTag.setScale(facing, 1); scene.add.existing(this)
    this.hurtbox.update(x, y)
  }

  updateCharacter(input: InputSnapshot, now: number, delta: number, groundY: number, arenaWidth: number): void {
    const dt = delta / 1000
    this.wasGrounded = this.isGrounded
    this.isGuarding = input.guard && this.isGrounded && now >= this.hitstunUntil
    if (now >= this.hitstunUntil) {
      const direction = Number(input.right) - Number(input.left)
      if (direction !== 0) { this.facing = direction > 0 ? 1 : -1; this.setScale(this.facing, 1); this.nameTag.setScale(this.facing, 1) }
      if (input.aimX !== null) { this.facing = input.aimX >= this.x ? 1 : -1; this.setScale(this.facing, 1); this.nameTag.setScale(this.facing, 1) }
      if (input.jumpPressed && this.isGrounded && !this.isGuarding) { this.velocityY = -this.definition.stats.jumpPower; this.isGrounded = false }
      if ((input.dashLeft || input.dashRight) && !this.isGuarding && now >= this.dashUntil) { this.facing = input.dashRight ? 1 : -1; this.setScale(this.facing, 1); this.nameTag.setScale(this.facing, 1); this.velocityX = this.facing * 620; this.dashStartedAt = now; this.dashUntil = now + 180; this.invulnerableUntil = now + 240 }
    }
    const direction = Number(input.right) - Number(input.left)
    const targetVelocityX = now < this.dashUntil ? this.facing * 620 : now < this.hitstunUntil ? 0 : direction * this.definition.stats.moveSpeed
    if (now < this.immobilizedUntil) { this.velocityX = damp(this.velocityX, 0, 28, dt); this.velocityY = damp(this.velocityY, 0, 28, dt) } else { this.velocityX = damp(this.velocityX, targetVelocityX, direction === 0 || now < this.hitstunUntil ? 24 : 18, dt); this.velocityY += 1450 * dt; this.x += this.velocityX * dt; this.y += this.velocityY * dt }
    if (this.y >= groundY) { this.y = groundY; this.velocityY = 0; this.isGrounded = true }
    if (!this.wasGrounded && this.isGrounded) this.landingUntil = now + 180
    this.x = Phaser.Math.Clamp(this.x, 45, arenaWidth - 45); this.setDepth(this.y); this.hurtbox.update(this.x, this.y)
    if (this.fullManifestActive(now)) { this.unlimitedEnergy = true; this.energy = this.definition.stats.maxEnergy } else this.unlimitedEnergy = false
    this.energy = Math.min(this.definition.stats.maxEnergy, this.energy + delta * 0.0028); this.ultimate = Math.min(100, this.ultimate + delta * 0.0035)
    this.updateVisuals(now)
  }

  startAttack(kind: AttackKind, now: number): Hitbox | null {
    if (!this.canAct(now)) return null
    const comboIndex = this.combo.next(kind, now)
    const isStrong = kind === 'strong'; const finalHit = !isStrong && comboIndex === 2
    this.attackDuration = isStrong ? 520 : finalHit ? 430 : comboIndex === 1 ? 265 : 235; this.attackStartedAt = now; this.attackUntil = now + this.attackDuration
    this.energy = Math.max(0, this.energy - this.energyCost(isStrong ? 8 : 1)); this.ultimate = Math.min(100, this.ultimate + (isStrong ? 7 : 2)); this.updateVisuals(now)
    const range = isStrong ? 98 : finalHit ? 84 : 70
    const domainPower = this.domainActive(now) ? 1.28 : 1; const manifestPower = this.fullManifestActive(now) ? 1.2 : 1
    const damage = (isStrong ? this.definition.stats.strongDamage : this.definition.stats.attackDamage * (finalHit ? 1.45 : comboIndex === 1 ? 1.08 : 1)) * domainPower * manifestPower
    return new Hitbox({ owner: this.slot, x: this.x + this.facing * range / 2, y: this.y - 73, width: range, height: 48, damage, knockbackX: this.facing * (isStrong || finalHit ? 430 : 190), knockbackY: isStrong ? -80 : -25, activeUntil: now + 95 })
  }

  receiveDamage(damage: number, knockbackX: number, knockbackY: number, now: number, technique = 'basic', bypassInfinity = false): boolean {
    if ((now < this.invulnerableUntil && !(bypassInfinity && this.infinityActive(now))) || this.hp <= 0) return false
    if (this.definition.id === 'sukuna' && this.hp - damage <= this.definition.stats.maxHp * 0.25 && !this.mahoragaSummoned) {
      this.mahoragaSummoned = true; this.adaptedTechnique = technique; this.ultimate = 0; this.hp = Math.max(1, Math.round(this.definition.stats.maxHp * 0.45)); this.velocityX = 0; this.velocityY = -180; this.isGrounded = false; this.hitstunUntil = now + 500; this.invulnerableUntil = now + 900; this.recoilDirection = knockbackX === 0 ? -this.facing : Math.sign(knockbackX); this.recoilUntil = now + 260; this.updateVisuals(now); return true
    }
    const adaptedDamage = this.mahoragaSummoned && this.adaptedTechnique === technique ? Math.max(1, Math.round(damage * 0.25)) : damage
    if (this.mahoragaSummoned && this.adaptedTechnique === null) this.adaptedTechnique = technique
    this.hp = Math.max(0, this.hp - adaptedDamage); this.velocityX = knockbackX; this.velocityY = knockbackY; this.isGrounded = false; this.recoilDirection = knockbackX === 0 ? -this.facing : Math.sign(knockbackX); this.recoilUntil = now + 260; this.hitstunUntil = now + 260; this.invulnerableUntil = now + 420; this.ultimate = Math.min(100, this.ultimate + 4); this.updateVisuals(now); return true
  }

  activateDomain(now: number): boolean {
    if (!this.canAct(now) || this.domainActive(now) || this.domainBlocked(now) || !this.spendFixedEnergy(20)) return false
    this.ultimate = 0; this.domainUntil = now + 6500; this.invulnerableUntil = now + 420; this.hitstunUntil = now + 260; this.attackStartedAt = now; this.attackDuration = 520; this.attackUntil = now + this.attackDuration
    return true
  }

  domainActive(now: number): boolean { return this.domainUntil > now }
  blockDomain(now: number): void { this.domainBlockedUntil = now + 10000 }
  domainBlocked(now: number): boolean { return this.domainBlockedUntil > now }
  domainBlockRemaining(now: number): number { return Math.max(0, this.domainBlockedUntil - now) }
  activateInfinity(now: number): boolean { if (this.definition.id !== 'gojo' || this.infinityActive(now)) return false; this.infinityUntil = now + 5000; this.invulnerableUntil = Math.max(this.invulnerableUntil, this.infinityUntil); return true }
  infinityActive(now: number): boolean { return this.infinityUntil > now }
  activateSimpleDomain(now: number): boolean { if (this.simpleDomainActive(now) || !this.spendEnergy(20)) return false; this.simpleDomainUntil = now + 3800; return true }
  simpleDomainActive(now: number): boolean { return this.simpleDomainUntil > now }
  activateFullManifest(now: number): boolean { if (this.definition.id !== 'yuta' || this.fullManifestUsed || this.fullManifestActive(now)) return false; this.fullManifestUsed = true; this.fullManifestUntil = now + 30000; this.unlimitedEnergy = true; this.energy = this.definition.stats.maxEnergy; return true }
  fullManifestActive(now: number): boolean { return this.fullManifestUntil > now }
  heal(amount: number): void { this.hp = Math.min(this.definition.stats.maxHp, this.hp + amount) }
  canAct(now: number): boolean { return this.hp > 0 && now >= this.hitstunUntil && now >= this.attackUntil && now >= this.immobilizedUntil && !this.isGuarding }
  beginAction(now: number, duration: number): boolean {
    if (!this.canAct(now)) return false
    this.attackStartedAt = now; this.attackDuration = duration; this.attackUntil = now + duration; this.updateVisuals(now); return true
  }
  spendEnergy(amount: number): boolean { if (this.unlimitedEnergy) return true; const actualCost = this.energyCost(amount); if (this.energy < actualCost) return false; this.energy -= actualCost; return true }
  spendFixedEnergy(amount: number): boolean { if (this.unlimitedEnergy) return true; const actualCost = this.energyCost(amount); if (this.energy < actualCost) return false; this.energy -= actualCost; return true }

  private energyCost(amount: number): number { return this.definition.id === 'gojo' ? 1 : Math.max(0.1, amount * this.energyCostMultiplier) }

  resetForRound(x: number, facing: 1 | -1): void {
    this.setPosition(x, 590); this.facing = facing; this.setScale(facing, 1); this.nameTag.setScale(facing, 1); this.hp = this.definition.stats.maxHp; this.energy = this.definition.stats.maxEnergy; this.ultimate = 0; this.domainUntil = 0; this.domainBlockedUntil = 0; this.simpleDomainUntil = 0; this.fullManifestUntil = 0; this.fullManifestUsed = false; this.infinityUntil = 0; this.unlimitedEnergy = false; this.mahoragaSummoned = false; this.adaptedTechnique = null; this.immobilizedUntil = 0; this.velocityX = 0; this.velocityY = 0; this.isGrounded = true; this.wasGrounded = true; this.hitstunUntil = 0; this.invulnerableUntil = 0; this.dashUntil = 0; this.dashStartedAt = 0; this.landingUntil = 0; this.recoilUntil = 0; this.attackUntil = 0; this.attackStartedAt = 0; this.attackDuration = 0; this.combo.reset()
  }

  private updateVisuals(now: number): void {
    const attacking = now < this.attackUntil; const stunned = now < this.hitstunUntil; const progress = this.attackDuration > 0 ? Phaser.Math.Clamp((now - this.attackStartedAt) / this.attackDuration, 0, 1) : 0
    const attackPhase = attackMotionPhase(progress); const speedRatio = clamp01(Math.abs(this.velocityX) / this.definition.stats.moveSpeed); const forwardSpeed = clamp01((this.velocityX * this.facing) / 620); const dashProgress = this.dashUntil > this.dashStartedAt ? clamp01((now - this.dashStartedAt) / (this.dashUntil - this.dashStartedAt)) : 1; const dashActive = now < this.dashUntil
    const landingProgress = this.landingUntil > now ? 1 - (this.landingUntil - now) / 180 : 0; const landing = easeOutCubic(landingProgress); const recoilProgress = this.recoilUntil > now ? 1 - (this.recoilUntil - now) / 260 : 1; const recoil = this.recoilUntil > now ? Math.sin(Math.PI * clamp01(recoilProgress)) : 0
    const bob = this.isGrounded ? Math.sin(now * 0.006) * (0.9 + speedRatio * 1.4) : 0
    const anticipation = attacking ? attackPhase.anticipation : 0; const impact = attacking ? attackPhase.impact : 0
    const baseLean = forwardSpeed * 0.07 - Math.min(1, Math.abs(this.velocityX) / 900) * 0.1
    let xOffset = forwardSpeed * 2 - anticipation * 5 + impact * 8
    let yOffset = -bob - landing * 4 - recoil * 4
    let rotation = baseLean - anticipation * 0.12 + impact * 0.11
    let scaleX = 1 + impact * 0.08 - landing * 0.1
    let scaleY = 1 - impact * 0.06 + landing * 0.1
    if (stunned) { xOffset += this.recoilDirection * recoil * 10; rotation += this.recoilDirection * recoil * 0.15; scaleX -= recoil * 0.07; scaleY += recoil * 0.08 }
    if (this.definition.id === 'yuta') { rotation -= impact * 0.08; xOffset += impact * 3 }
    if (this.definition.id === 'gojo') { scaleX += impact * 0.04; scaleY -= impact * 0.04; yOffset -= impact * 2 }
    this.bodyGraphic.setAlpha(stunned ? 0.5 : 1); this.bodyGraphic.setPosition(xOffset, yOffset); this.bodyGraphic.setRotation(rotation); this.bodyGraphic.setScale(scaleX, scaleY)
    this.auraGraphic.clear(); this.motionGraphic.clear(); this.signatureGraphic.clear(); this.impactGraphic.clear(); this.drawMotionEffects(attacking, impact, speedRatio, forwardSpeed, dashActive, dashProgress, landing); this.drawSignature(attacking, progress, impact, now)
    if (this.isGuarding) { this.auraGraphic.lineStyle(4, 0x8fe9ff, 0.65); this.auraGraphic.strokeCircle(0, -62, 48) }
    if (attacking) { this.auraGraphic.lineStyle(5, this.definition.color, 0.85); this.auraGraphic.beginPath(); this.auraGraphic.arc(22 + impact * 8, -70, 58 + impact * 9, -1.25, 1.25, false); this.auraGraphic.strokePath() }
    if (this.domainUntil > now) { this.auraGraphic.lineStyle(2, this.definition.color, 0.7); this.auraGraphic.strokeCircle(0, -62, 80); this.auraGraphic.lineStyle(1, 0xffffff, 0.25); this.auraGraphic.strokeCircle(0, -62, 91) }
    if (this.simpleDomainUntil > now) { this.auraGraphic.lineStyle(4, 0xf3dc92, 0.9); this.auraGraphic.strokeCircle(0, -62, 68); this.auraGraphic.lineStyle(1, 0xfff3bf, 0.75); this.auraGraphic.strokeCircle(0, -62, 76) }
    if (this.infinityUntil > now) { this.auraGraphic.lineStyle(5, 0xb7f3ff, 0.9); this.auraGraphic.strokeCircle(0, -62, 53); this.auraGraphic.lineStyle(2, 0xffffff, 0.8); this.auraGraphic.strokeCircle(0, -62, 63) }
    if (this.fullManifestUntil > now) { this.auraGraphic.lineStyle(3, 0xd7c6ff, 0.85); this.auraGraphic.strokeCircle(0, -62, 56); this.auraGraphic.lineStyle(2, this.definition.color, 0.65); this.auraGraphic.strokeCircle(0, -62, 66) }
    if (this.mahoragaSummoned && this.definition.id === 'sukuna') { this.auraGraphic.lineStyle(4, 0xffd56f, 0.9); this.auraGraphic.strokeCircle(0, -62, 88); this.auraGraphic.lineStyle(2, 0xfff1b0, 0.85); this.auraGraphic.strokeCircle(0, -62, 98) }
  }

  private drawMotionEffects(attacking: boolean, impact: number, speedRatio: number, forwardSpeed: number, dashActive: boolean, dashProgress: number, landing: number): void {
    const color = this.definition.color
    if (speedRatio > 0.08 || dashActive) {
      const trail = dashActive ? 0.55 * (1 - easeOutCubic(dashProgress)) + 0.14 : speedRatio * 0.22
      for (let index = 0; index < 3; index += 1) {
        const offset = 15 + index * 13 + forwardSpeed * 10
        this.motionGraphic.lineStyle(2 + (dashActive ? 1 : 0), color, trail * (1 - index * 0.24))
        this.motionGraphic.beginPath(); this.motionGraphic.moveTo(-offset, -54 + index * 8); this.motionGraphic.lineTo(-offset - 18 - forwardSpeed * 22, -54 + index * 8); this.motionGraphic.strokePath()
      }
    }
    if (dashActive) {
      const pulse = easeOutBack(Math.min(1, dashProgress * 1.5))
      this.motionGraphic.lineStyle(3, 0xf0fdff, 0.42 * (1 - dashProgress)); this.motionGraphic.strokeEllipse(-28 - dashProgress * 28, -61, 48 + pulse * 35, 62)
      this.auraGraphic.lineStyle(2, color, 0.45 * (1 - dashProgress)); this.auraGraphic.strokeCircle(0, -62, 48 + pulse * 24)
    }
    if (landing > 0) {
      this.motionGraphic.lineStyle(2, color, 0.55 * (1 - landing)); this.motionGraphic.strokeEllipse(0, -5, 58 + landing * 35, 12 + landing * 4)
    }
    if (attacking) {
      const slashAlpha = 0.28 + impact * 0.52
      this.motionGraphic.lineStyle(this.definition.id === 'gojo' ? 3 : 4, color, slashAlpha)
      this.motionGraphic.beginPath(); this.motionGraphic.arc(18 + impact * 12, -66, 57 + impact * 13, -1.65 + impact * 0.65, -0.25 + impact * 0.65, false); this.motionGraphic.strokePath()
      if (this.definition.id === 'yuta') {
        this.motionGraphic.lineStyle(3, 0xf6fdff, 0.32 + impact * 0.56); this.motionGraphic.beginPath(); this.motionGraphic.arc(22, -67, 71, -1.7 + impact * 1.4, -0.62 + impact * 1.4, false); this.motionGraphic.strokePath()
      }
      if (this.definition.id === 'gojo') {
        this.motionGraphic.lineStyle(2, 0xbdf7ff, 0.4 + impact * 0.45); this.motionGraphic.strokeCircle(44 + impact * 16, -68, 17 + impact * 18)
        this.motionGraphic.lineStyle(2, 0xffffff, 0.28 + impact * 0.4); this.motionGraphic.strokeCircle(44 + impact * 16, -68, 28 + impact * 24)
      }
    }
    if (impact > 0.72) {
      const burst = easeInOutSine((impact - 0.72) / 0.28)
      this.impactGraphic.lineStyle(3, 0xf4fdff, 0.65 * burst)
      for (let index = 0; index < 6; index += 1) { const angle = index * Math.PI / 3 - 0.4; const inner = 28 + burst * 8; const outer = 45 + burst * 18; this.impactGraphic.lineBetween(Math.cos(angle) * inner, -67 + Math.sin(angle) * inner, Math.cos(angle) * outer, -67 + Math.sin(angle) * outer) }
    }
  }

  private drawBody(): void {
    const color = this.definition.color
    this.bodyGraphic.fillStyle(0x091525, 1); this.bodyGraphic.fillCircle(0, -62, 43)
    this.bodyGraphic.fillStyle(color, 1); this.bodyGraphic.fillCircle(0, -62, 38)
    this.bodyGraphic.lineStyle(3, Phaser.Display.Color.IntegerToColor(color).lighten(35).color, 1); this.bodyGraphic.strokeCircle(0, -62, 38)
    this.bodyGraphic.lineStyle(2, 0xe5fbff, 0.55); this.bodyGraphic.strokeCircle(0, -62, 31)
    this.bodyGraphic.fillStyle(0x07111f, 0.8); this.bodyGraphic.fillCircle(12, -71, 5); this.bodyGraphic.fillCircle(-12, -71, 5)
    this.bodyGraphic.fillStyle(0xe5fbff, 1); this.bodyGraphic.fillCircle(13, -72, 2); this.bodyGraphic.fillCircle(-11, -72, 2)
  }

  private drawSignature(attacking: boolean, progress: number, impact = 0, now = 0): void {
    const color = this.definition.color
    if (this.definition.id === 'yuta') {
      const swordBreath = attacking ? 0 : Math.sin(now * 0.004) * 2.2
      this.signatureGraphic.lineStyle(5, 0xeafcff, 1); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(17, -51); this.signatureGraphic.lineTo(attacking ? 65 + impact * 12 : 55 + swordBreath, attacking ? -82 - impact * 6 : -63 + swordBreath * 0.35); this.signatureGraphic.strokePath(); this.signatureGraphic.lineStyle(3, color, 1); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(10, -57); this.signatureGraphic.lineTo(24, -48); this.signatureGraphic.strokePath()
      if (!attacking) { this.signatureGraphic.lineStyle(2, color, 0.35); this.signatureGraphic.beginPath(); this.signatureGraphic.arc(20, -67, 61, -1.5 + swordBreath * 0.01, -0.85 + swordBreath * 0.01, false); this.signatureGraphic.strokePath() }
      if (attacking) { this.auraGraphic.lineStyle(5, color, 0.9); this.auraGraphic.beginPath(); this.auraGraphic.arc(17, -67, 67, -1.6 + progress * 1.1, -0.5 + progress * 1.1, false); this.auraGraphic.strokePath() }
    } else if (this.definition.id === 'uro') {
      this.signatureGraphic.lineStyle(2, 0xcabaff, 0.85); this.signatureGraphic.strokeCircle(0, -102, 22); this.signatureGraphic.strokeCircle(0, -102, 29); this.signatureGraphic.beginPath(); this.signatureGraphic.arc(0, -102, 37, -2.4, -0.7, false); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(4, color, 0.85); this.auraGraphic.beginPath(); this.auraGraphic.arc(22, -75, 72, -1.4 + progress * 0.9, 0.1 + progress * 0.9, false); this.auraGraphic.strokePath() }
    } else if (this.definition.id === 'gojo') {
      const infinityPulse = attacking ? 0 : Math.sin(now * 0.0032) * 2
      this.signatureGraphic.lineStyle(3, 0xb9f6ff, 0.85); this.signatureGraphic.strokeCircle(0, -98, 19 + infinityPulse); this.signatureGraphic.lineStyle(4, color, 0.9); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(13, -63); this.signatureGraphic.lineTo(attacking ? 48 + impact * 18 : 35 + infinityPulse, -68); this.signatureGraphic.strokePath()
      if (!attacking) { const orbit = now * 0.0017; this.signatureGraphic.lineStyle(2, 0xbdf7ff, 0.42); this.signatureGraphic.beginPath(); this.signatureGraphic.arc(0, -98, 28, orbit, orbit + 1.65, false); this.signatureGraphic.strokePath() }
      if (attacking) { this.auraGraphic.lineStyle(3, 0x8eeeff, 0.8); this.auraGraphic.strokeCircle(50 + impact * 18, -68, 22 + progress * 10 + impact * 12) }
    } else if (this.definition.id === 'sukuna') {
      this.signatureGraphic.lineStyle(2, 0xff9db9, 0.85); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(-7, -104); this.signatureGraphic.lineTo(2, -96); this.signatureGraphic.moveTo(7, -104); this.signatureGraphic.lineTo(-2, -96); this.signatureGraphic.moveTo(-11, -88); this.signatureGraphic.lineTo(10, -88); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(4, color, 0.95); this.auraGraphic.beginPath(); this.auraGraphic.moveTo(14, -56); this.auraGraphic.lineTo(82, -111 + progress * 62); this.auraGraphic.moveTo(14, -48); this.auraGraphic.lineTo(75, -21 - progress * 55); this.auraGraphic.strokePath() }
    } else if (this.definition.id === 'yuji') {
      this.signatureGraphic.fillStyle(0xffb18a, 1); this.signatureGraphic.fillCircle(30, -43, 8); this.signatureGraphic.fillCircle(-30, -43, 8); this.signatureGraphic.lineStyle(3, color, 1); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(-14, -61); this.signatureGraphic.lineTo(-30, -43); this.signatureGraphic.moveTo(14, -61); this.signatureGraphic.lineTo(30, -43); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(5, 0xffd5a5, 0.9); this.auraGraphic.strokeCircle(42 + progress * 12, -43, 15) }
    } else if (this.definition.id === 'megumi') {
      this.signatureGraphic.lineStyle(3, 0x9bb5ff, 0.85); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(-12, -58); this.signatureGraphic.lineTo(-4, -72); this.signatureGraphic.lineTo(4, -58); this.signatureGraphic.moveTo(12, -58); this.signatureGraphic.lineTo(4, -72); this.signatureGraphic.lineTo(-4, -58); this.signatureGraphic.strokePath(); this.signatureGraphic.fillStyle(0x161832, 0.9); this.signatureGraphic.fillEllipse(0, 0, 62, 15)
      if (attacking) { this.auraGraphic.lineStyle(4, color, 0.85); this.auraGraphic.beginPath(); this.auraGraphic.arc(0, -54, 76, -1.2, 1.2, false); this.auraGraphic.strokePath() }
    }
    if (this.mahoragaSummoned && this.definition.id === 'sukuna') { this.signatureGraphic.lineStyle(3, 0xffd56f, 0.9); this.signatureGraphic.strokeCircle(0, -122, 27); this.signatureGraphic.lineStyle(2, 0xfff1b0, 0.9); for (let index = 0; index < 8; index += 1) { const angle = index * Math.PI / 4; this.signatureGraphic.lineBetween(0, -122, Math.cos(angle) * 42, -122 + Math.sin(angle) * 42) } }
  }
}
