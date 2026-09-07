import Phaser from 'phaser'
import type { AttackProfile, SkillKey, Vector2 } from '../types/gameTypes'
import { resolveCircleMovement } from '../systems/CollisionSystem'
import type { Enemy } from './Enemy'
import type { CombatSystem } from '../systems/CombatSystem'

const BASIC_ATTACKS: AttackProfile[] = [
  { damage: 18, range: 82, arc: 1.8, knockback: 120, color: 0x69d8ff },
  { damage: 22, range: 88, arc: 1.8, knockback: 145, color: 0x8bb5ff },
  { damage: 38, range: 108, arc: 2.1, knockback: 330, color: 0xbde8ff },
]

export class Player extends Phaser.GameObjects.Container {
  readonly radius = 22
  readonly maxHp = 160
  readonly maxEnergy = 100
  hp = this.maxHp
  energy = this.maxEnergy
  facingAngle = 0
  lastAttackAt = -Infinity
  comboIndex = 0
  comboExpiresAt = 0
  invulnerableUntil = 0
  ultimateUntil = 0
  private lastDashAt = -Infinity
  private readonly bodyGraphic: Phaser.GameObjects.Graphics
  private readonly blade: Phaser.GameObjects.Graphics
  private hitFlashUntil = 0
  private dashUntil = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.bodyGraphic = scene.add.graphics()
    this.bodyGraphic.fillStyle(0x1b86d1, 1)
    this.bodyGraphic.fillCircle(0, 0, 21)
    this.bodyGraphic.lineStyle(2, 0x9be7ff, 0.9)
    this.bodyGraphic.strokeCircle(0, 0, 21)
    this.bodyGraphic.fillStyle(0x0b2544, 1)
    this.bodyGraphic.fillCircle(7, -7, 4)
    this.blade = scene.add.graphics()
    this.blade.lineStyle(5, 0xe3fbff, 1)
    this.blade.beginPath(); this.blade.moveTo(13, -5); this.blade.lineTo(56, -5); this.blade.strokePath()
    this.blade.lineStyle(2, 0x4bc7ff, 0.9)
    this.blade.beginPath(); this.blade.moveTo(13, 3); this.blade.lineTo(53, 3); this.blade.strokePath()
    this.add([this.bodyGraphic, this.blade])
    this.setSize(44, 44).setDepth(y)
    scene.add.existing(this)
  }

  updateMovement(movement: Vector2, pointer: Vector2, now: number, delta: number, obstacles: Phaser.Geom.Rectangle[]): void {
    const direction = new Phaser.Math.Vector2(pointer.x - this.x, pointer.y - this.y)
    if (direction.lengthSq() > 1) { this.facingAngle = direction.angle(); this.setRotation(this.facingAngle) }
    const input = new Phaser.Math.Vector2(movement.x, movement.y)
    if (input.lengthSq() > 1) input.normalize()
    const speed = this.dashUntil > now ? 820 : 250
    const next = resolveCircleMovement(new Phaser.Math.Vector2(this.x, this.y), input.scale(speed * (delta / 1000)), this.radius, obstacles)
    this.setPosition(next.x, next.y).setDepth(this.y)
    this.bodyGraphic.setAlpha(this.hitFlashUntil > now ? 0.42 : 1)
  }

  tryBasicAttack(now: number, enemies: Enemy[], combat: CombatSystem): boolean {
    if (now - this.lastAttackAt < (this.ultimateActive(now) ? 220 : 360)) return false
    if (now > this.comboExpiresAt) this.comboIndex = 0
    const profile = BASIC_ATTACKS[this.comboIndex]
    this.comboIndex = (this.comboIndex + 1) % BASIC_ATTACKS.length
    this.lastAttackAt = now; this.comboExpiresAt = now + 780
    combat.meleeAttack(this, enemies, profile); combat.createSlashEffect(this.x, this.y, this.facingAngle, profile)
    return true
  }

  startDash(now: number, pointer: Vector2, obstacles: Phaser.Geom.Rectangle[]): boolean {
    if (now - this.lastDashAt < 800) return false
    const direction = new Phaser.Math.Vector2(pointer.x - this.x, pointer.y - this.y)
    if (direction.lengthSq() === 0) return false
    direction.normalize()
    const destination = resolveCircleMovement(new Phaser.Math.Vector2(this.x, this.y), direction.scale(135), this.radius, obstacles)
    this.setPosition(destination.x, destination.y)
    this.invulnerableUntil = now + 260; this.dashUntil = now + 120; this.lastDashAt = now
    return true
  }

  takeDamage(amount: number, now: number): boolean {
    if (now < this.invulnerableUntil || this.hp <= 0) return false
    this.hp = Math.max(0, this.hp - amount); this.hitFlashUntil = now + 150; this.invulnerableUntil = now + 500
    return true
  }

  spendEnergy(amount: number): boolean { if (this.energy < amount) return false; this.energy -= amount; return true }
  recoverEnergy(amount: number): void { this.energy = Math.min(this.maxEnergy, this.energy + amount) }
  activateUltimate(now: number): void { this.ultimateUntil = now + 10000 }
  ultimateActive(now: number): boolean { return this.ultimateUntil > now }
  getCooldownMs(key: SkillKey, now: number, cooldowns: Map<SkillKey, number>): number {
    const reduction = this.ultimateActive(now) ? 0.55 : 1
    return Math.max(0, ((cooldowns.get(key) ?? 0) - now) * reduction)
  }
}
