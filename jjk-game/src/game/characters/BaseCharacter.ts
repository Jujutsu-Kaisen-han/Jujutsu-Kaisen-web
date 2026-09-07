import Phaser from 'phaser'
import { CHARACTER_DEFINITIONS, type CharacterDefinition, type CharacterId, type PlayerSlot } from '../types/CharacterTypes'
import { Hitbox } from '../combat/Hitbox'
import { Hurtbox } from '../combat/Hurtbox'
import { ComboSystem } from '../combat/ComboSystem'
import type { AttackKind } from '../types/CombatTypes'
import type { InputSnapshot } from '../systems/InputManager'

export class BaseCharacter extends Phaser.GameObjects.Container {
  readonly definition: CharacterDefinition
  readonly slot: PlayerSlot
  readonly hurtbox = new Hurtbox()
  readonly combo = new ComboSystem()
  hp: number
  energy: number
  ultimate = 0
  domainUntil = 0
  fullManifestUntil = 0
  isGuarding = false
  isGrounded = true
  facing: 1 | -1
  hitstunUntil = 0
  invulnerableUntil = 0
  attackUntil = 0
  velocityX = 0
  velocityY = 0
  private readonly bodyGraphic: Phaser.GameObjects.Graphics
  private readonly auraGraphic: Phaser.GameObjects.Graphics
  private readonly signatureGraphic: Phaser.GameObjects.Graphics
  private readonly nameTag: Phaser.GameObjects.Text
  private dashUntil = 0
  private attackStartedAt = 0
  private attackDuration = 0

  constructor(scene: Phaser.Scene, id: CharacterId, slot: PlayerSlot, x: number, y: number, facing: 1 | -1) {
    super(scene, x, y)
    this.definition = CHARACTER_DEFINITIONS[id]; this.slot = slot; this.facing = facing
    this.hp = this.definition.stats.maxHp; this.energy = this.definition.stats.maxEnergy
    this.bodyGraphic = scene.add.graphics(); this.auraGraphic = scene.add.graphics(); this.signatureGraphic = scene.add.graphics()
    this.drawBody()
    this.nameTag = scene.add.text(0, -98, this.definition.name, { color: '#f5fbff', fontFamily: 'Space Mono, monospace', fontSize: '9px', fontStyle: 'bold', stroke: '#07111f', strokeThickness: 3 }).setOrigin(0.5)
    this.add([this.auraGraphic, this.bodyGraphic, this.signatureGraphic, this.nameTag]); this.setSize(76, 92); this.setDepth(y); this.setScale(facing, 1); this.nameTag.setScale(facing, 1); scene.add.existing(this)
    this.hurtbox.update(x, y)
  }

  updateCharacter(input: InputSnapshot, now: number, delta: number, groundY: number, arenaWidth: number): void {
    const dt = delta / 1000
    this.isGuarding = input.guard && this.isGrounded && now >= this.hitstunUntil
    if (now >= this.hitstunUntil) {
      const direction = Number(input.right) - Number(input.left)
      if (direction !== 0) { this.facing = direction > 0 ? 1 : -1; this.setScale(this.facing, 1); this.nameTag.setScale(this.facing, 1); this.velocityX = direction * this.definition.stats.moveSpeed }
      else this.velocityX *= 0.78
      if (input.jumpPressed && this.isGrounded && !this.isGuarding) { this.velocityY = -this.definition.stats.jumpPower; this.isGrounded = false }
      if ((input.dashLeft || input.dashRight) && !this.isGuarding && now >= this.dashUntil) { this.facing = input.dashRight ? 1 : -1; this.setScale(this.facing, 1); this.nameTag.setScale(this.facing, 1); this.velocityX = this.facing * 620; this.dashUntil = now + 180; this.invulnerableUntil = now + 240 }
    }
    this.velocityY += 1450 * dt; this.x += this.velocityX * dt; this.y += this.velocityY * dt
    if (this.y >= groundY) { this.y = groundY; this.velocityY = 0; this.isGrounded = true }
    this.x = Phaser.Math.Clamp(this.x, 45, arenaWidth - 45); this.setDepth(this.y); this.hurtbox.update(this.x, this.y)
    this.energy = Math.min(this.definition.stats.maxEnergy, this.energy + delta * 0.008); this.ultimate = Math.min(100, this.ultimate + delta * 0.0035)
    this.updateVisuals(now)
  }

  startAttack(kind: AttackKind, now: number): Hitbox | null {
    if (now < this.hitstunUntil || now < this.attackUntil || this.isGuarding) return null
    const comboIndex = this.combo.next(kind, now)
    const isStrong = kind === 'strong'; const finalHit = !isStrong && comboIndex === 2
    this.attackDuration = isStrong ? 540 : finalHit ? 460 : 300; this.attackStartedAt = now; this.attackUntil = now + this.attackDuration
    this.energy = Math.max(0, this.energy - (isStrong ? 8 : 1)); this.ultimate = Math.min(100, this.ultimate + (isStrong ? 7 : 2)); this.updateVisuals(now)
    const range = isStrong ? 98 : finalHit ? 84 : 70
    const domainPower = this.domainActive(now) ? 1.28 : 1; const manifestPower = this.fullManifestActive(now) ? 1.2 : 1
    const damage = (isStrong ? this.definition.stats.strongDamage : this.definition.stats.attackDamage * (finalHit ? 1.45 : comboIndex === 1 ? 1.08 : 1)) * domainPower * manifestPower
    return new Hitbox({ owner: this.slot, x: this.x + this.facing * range / 2, y: this.y - 73, width: range, height: 48, damage, knockbackX: this.facing * (isStrong || finalHit ? 430 : 190), knockbackY: isStrong ? -80 : -25, activeUntil: now + 95 })
  }

  receiveDamage(damage: number, knockbackX: number, knockbackY: number, now: number): void {
    if (now < this.invulnerableUntil || this.hp <= 0) return
    this.hp = Math.max(0, this.hp - damage); this.velocityX = knockbackX; this.velocityY = knockbackY; this.isGrounded = false; this.hitstunUntil = now + 260; this.invulnerableUntil = now + 420; this.ultimate = Math.min(100, this.ultimate + 4); this.updateVisuals(now)
  }

  activateDomain(now: number): boolean {
    if (this.ultimate < 100 || this.domainActive(now)) return false
    this.ultimate = 0; this.domainUntil = now + 6500; this.invulnerableUntil = now + 420; this.hitstunUntil = now + 260
    return true
  }

  domainActive(now: number): boolean { return this.domainUntil > now }
  activateFullManifest(now: number): boolean { if (this.definition.id !== 'yuta' || this.fullManifestActive(now) || !this.spendEnergy(28)) return false; this.fullManifestUntil = now + 8000; return true }
  fullManifestActive(now: number): boolean { return this.fullManifestUntil > now }
  heal(amount: number): void { this.hp = Math.min(this.definition.stats.maxHp, this.hp + amount) }
  spendEnergy(amount: number): boolean { if (this.energy < amount) return false; this.energy -= amount; return true }

  resetForRound(x: number, facing: 1 | -1): void {
    this.setPosition(x, 590); this.facing = facing; this.setScale(facing, 1); this.nameTag.setScale(facing, 1); this.hp = this.definition.stats.maxHp; this.energy = this.definition.stats.maxEnergy; this.ultimate = 0; this.domainUntil = 0; this.fullManifestUntil = 0; this.velocityX = 0; this.velocityY = 0; this.isGrounded = true; this.hitstunUntil = 0; this.invulnerableUntil = 0; this.combo.reset()
  }

  private updateVisuals(now: number): void {
    const attacking = now < this.attackUntil; const stunned = now < this.hitstunUntil; const progress = this.attackDuration > 0 ? Phaser.Math.Clamp((now - this.attackStartedAt) / this.attackDuration, 0, 1) : 0
    this.bodyGraphic.setAlpha(stunned ? 0.45 : 1); this.bodyGraphic.setScale(this.definition.id === 'yuji' && attacking ? 1.08 : 1, this.definition.id === 'yuji' && attacking ? 0.92 : 1); this.auraGraphic.clear(); this.signatureGraphic.clear(); this.drawSignature(attacking, progress)
    if (this.isGuarding) { this.auraGraphic.lineStyle(4, 0x8fe9ff, 0.65); this.auraGraphic.strokeCircle(0, -62, 48) }
    if (attacking) { this.auraGraphic.lineStyle(5, this.definition.color, 0.85); this.auraGraphic.beginPath(); this.auraGraphic.arc(22, -70, 58, -1.25, 1.25, false); this.auraGraphic.strokePath() }
    if (this.domainUntil > now) { this.auraGraphic.lineStyle(2, this.definition.color, 0.7); this.auraGraphic.strokeCircle(0, -62, 80); this.auraGraphic.lineStyle(1, 0xffffff, 0.25); this.auraGraphic.strokeCircle(0, -62, 91) }
    if (this.fullManifestUntil > now) { this.auraGraphic.lineStyle(3, 0xd7c6ff, 0.85); this.auraGraphic.strokeCircle(0, -62, 56); this.auraGraphic.lineStyle(2, this.definition.color, 0.65); this.auraGraphic.strokeCircle(0, -62, 66) }
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

  private drawSignature(attacking: boolean, progress: number): void {
    const color = this.definition.color
    if (this.definition.id === 'yuta') {
      this.signatureGraphic.lineStyle(5, 0xeafcff, 1); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(17, -51); this.signatureGraphic.lineTo(attacking ? 65 : 55, attacking ? -82 : -63); this.signatureGraphic.strokePath(); this.signatureGraphic.lineStyle(3, color, 1); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(10, -57); this.signatureGraphic.lineTo(24, -48); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(5, color, 0.9); this.auraGraphic.beginPath(); this.auraGraphic.arc(17, -67, 67, -1.6 + progress * 1.1, -0.5 + progress * 1.1, false); this.auraGraphic.strokePath() }
    } else if (this.definition.id === 'uro') {
      this.signatureGraphic.lineStyle(2, 0xcabaff, 0.85); this.signatureGraphic.strokeCircle(0, -102, 22); this.signatureGraphic.strokeCircle(0, -102, 29); this.signatureGraphic.beginPath(); this.signatureGraphic.arc(0, -102, 37, -2.4, -0.7, false); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(4, color, 0.85); this.auraGraphic.beginPath(); this.auraGraphic.arc(22, -75, 72, -1.4 + progress * 0.9, 0.1 + progress * 0.9, false); this.auraGraphic.strokePath() }
    } else if (this.definition.id === 'gojo') {
      this.signatureGraphic.lineStyle(3, 0xb9f6ff, 0.85); this.signatureGraphic.strokeCircle(0, -98, 19); this.signatureGraphic.lineStyle(4, color, 0.9); this.signatureGraphic.beginPath(); this.signatureGraphic.moveTo(13, -63); this.signatureGraphic.lineTo(attacking ? 48 : 35, -68); this.signatureGraphic.strokePath()
      if (attacking) { this.auraGraphic.lineStyle(3, 0x8eeeff, 0.8); this.auraGraphic.strokeCircle(50, -68, 22 + progress * 10) }
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
  }
}
