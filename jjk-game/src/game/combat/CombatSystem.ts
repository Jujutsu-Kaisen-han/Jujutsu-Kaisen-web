import Phaser from 'phaser'
import type { BaseCharacter } from '../characters/BaseCharacter'
import { calculateDamage } from './DamageCalculator'
import { Hitbox } from './Hitbox'
import type { AttackKind } from '../types/CombatTypes'

export class CombatSystem {
  private readonly scene: Phaser.Scene
  private readonly onHit: (attacker: BaseCharacter, defender: BaseCharacter, damage: number) => void

  constructor(scene: Phaser.Scene, onHit: (attacker: BaseCharacter, defender: BaseCharacter, damage: number) => void) { this.scene = scene; this.onHit = onHit }

  attack(attacker: BaseCharacter, defender: BaseCharacter, kind: AttackKind, now: number): boolean {
    const hitbox = attacker.startAttack(kind, now)
    if (!hitbox) return false
    const attackRect = new Phaser.Geom.Rectangle(hitbox.bounds.x, hitbox.bounds.y, hitbox.bounds.width, hitbox.bounds.height)
    const hurtRect = new Phaser.Geom.Rectangle(defender.hurtbox.bounds.x, defender.hurtbox.bounds.y, defender.hurtbox.bounds.width, defender.hurtbox.bounds.height)
    if (!Phaser.Geom.Intersects.RectangleToRectangle(attackRect, hurtRect)) return false
    const damage = calculateDamage(attacker, defender, hitbox)
    defender.receiveDamage(damage, hitbox.bounds.knockbackX, hitbox.bounds.knockbackY, now, kind)
    this.onHit(attacker, defender, damage)
    this.createHitEffect(defender.x, defender.y - 70, attacker.definition.color)
    return true
  }

  domainStrike(attacker: BaseCharacter, defender: BaseCharacter, now: number): boolean {
    if (!attacker.domainActive(now) || defender.hp <= 0) return false
    if (defender.simpleDomainActive(now)) { this.showTechniqueLabel(defender.x, defender.y - 112, '간이영역 // 필중 무효'); return false }
    const hitbox = new Hitbox({ owner: attacker.slot, x: defender.x - 105, y: defender.y - 118, width: 210, height: 120, damage: attacker.definition.stats.attackDamage * 0.85, knockbackX: attacker.facing * 100, knockbackY: -35, activeUntil: now + 80 })
    const attackRect = new Phaser.Geom.Rectangle(hitbox.bounds.x, hitbox.bounds.y, hitbox.bounds.width, hitbox.bounds.height)
    const hurtRect = new Phaser.Geom.Rectangle(defender.hurtbox.bounds.x, defender.hurtbox.bounds.y, defender.hurtbox.bounds.width, defender.hurtbox.bounds.height)
    if (!Phaser.Geom.Intersects.RectangleToRectangle(attackRect, hurtRect)) return false
    const damage = calculateDamage(attacker, defender, hitbox); defender.receiveDamage(damage, hitbox.bounds.knockbackX, hitbox.bounds.knockbackY, now, 'domain'); this.onHit(attacker, defender, damage); this.createHitEffect(defender.x, defender.y - 70, attacker.definition.color); return true
  }

  rikaAttack(attacker: BaseCharacter, defender: BaseCharacter, now: number): boolean { return this.specialStrike(attacker, defender, 150, 24, now, 'RIKA') }

  rangedStrike(attacker: BaseCharacter, defender: BaseCharacter, range: number, damage: number, now: number, label: string): boolean {
    const direction = defender.x >= attacker.x ? 1 : -1
    const aimedAtTarget = direction === attacker.facing
    const distance = Math.abs(defender.x - attacker.x)
    const projectile = this.scene.add.graphics().setDepth(18)
    projectile.fillStyle(attacker.definition.color, 0.95); projectile.fillCircle(0, 0, 10)
    projectile.lineStyle(3, 0xf5fbff, 0.85); projectile.strokeCircle(0, 0, 15)
    projectile.setPosition(attacker.x + attacker.facing * 42, attacker.y - 62)
    const destination = attacker.x + attacker.facing * Math.min(range, distance)
    this.scene.tweens.add({ targets: projectile, x: destination, duration: 150, onComplete: () => projectile.destroy() })
    if (!aimedAtTarget || distance > range || Math.abs(defender.y - attacker.y) > 105) return false
    const hitbox = new Hitbox({ owner: attacker.slot, x: defender.x - 42, y: defender.y - 108, width: 84, height: 120, damage, knockbackX: attacker.facing * 210, knockbackY: -35, activeUntil: now + 80 })
    const actualDamage = calculateDamage(attacker, defender, hitbox)
    defender.receiveDamage(actualDamage, hitbox.bounds.knockbackX, hitbox.bounds.knockbackY, now, label); this.onHit(attacker, defender, actualDamage); this.createHitEffect(defender.x, defender.y - 70, attacker.definition.color); this.showTechniqueLabel(defender.x, defender.y - 112, label)
    return true
  }

  specialStrike(attacker: BaseCharacter, defender: BaseCharacter, width: number, damage: number, now: number, label: string): boolean {
    const hitbox = new Hitbox({ owner: attacker.slot, x: attacker.x + attacker.facing * width / 2, y: defender.y - 86, width, height: 108, damage, knockbackX: attacker.facing * 280, knockbackY: -45, activeUntil: now + 120 })
    const attackRect = new Phaser.Geom.Rectangle(hitbox.bounds.x, hitbox.bounds.y, hitbox.bounds.width, hitbox.bounds.height)
    const hurtRect = new Phaser.Geom.Rectangle(defender.hurtbox.bounds.x, defender.hurtbox.bounds.y, defender.hurtbox.bounds.width, defender.hurtbox.bounds.height)
    if (!Phaser.Geom.Intersects.RectangleToRectangle(attackRect, hurtRect)) return false
    const actualDamage = calculateDamage(attacker, defender, hitbox); defender.receiveDamage(actualDamage, hitbox.bounds.knockbackX, hitbox.bounds.knockbackY, now, label); this.onHit(attacker, defender, actualDamage); this.createHitEffect(defender.x, defender.y - 70, attacker.definition.color); this.showTechniqueLabel(defender.x, defender.y - 112, label); return true
  }

  guaranteedStrike(attacker: BaseCharacter, defender: BaseCharacter, damage: number, now: number, label: string, isDomainDamage = false): void {
    if (defender.hp <= 0) return
    if (isDomainDamage && defender.simpleDomainActive(now)) { this.showTechniqueLabel(defender.x, defender.y - 112, '간이영역 // 필중 무효'); return }
    defender.receiveDamage(Math.round(damage), attacker.facing * 90, -25, now, isDomainDamage ? 'domain' : label); this.onHit(attacker, defender, Math.round(damage)); this.createHitEffect(defender.x, defender.y - 70, 0xffe9a6); this.showTechniqueLabel(defender.x, defender.y - 112, label)
  }

  copiedTechniqueEffect(attacker: BaseCharacter, defender: BaseCharacter, label: string): void { this.showTechniqueLabel(defender.x, defender.y - 110, label); this.createHitEffect(defender.x, defender.y - 70, attacker.definition.color) }

  healEffect(owner: BaseCharacter, label = '반전술식'): void { const effect = this.scene.add.graphics(); effect.lineStyle(4, 0x9effcb, 0.9); effect.strokeCircle(owner.x, owner.y - 65, 26); this.scene.tweens.add({ targets: effect, scale: 1.7, alpha: 0, duration: 420, onComplete: () => effect.destroy() }); this.showTechniqueLabel(owner.x, owner.y - 130, label) }
  manifestEffect(owner: BaseCharacter): void { const effect = this.scene.add.graphics(); effect.lineStyle(5, 0xd8c5ff, 0.95); effect.strokeCircle(owner.x, owner.y - 64, 42); this.scene.tweens.add({ targets: effect, scale: 1.8, alpha: 0, duration: 500, onComplete: () => effect.destroy() }); this.showTechniqueLabel(owner.x, owner.y - 130, 'RIKA // COMPLETE') }
  simpleDomainEffect(owner: BaseCharacter): void { const effect = this.scene.add.graphics(); effect.lineStyle(5, 0xf3dc92, 0.95); effect.strokeCircle(owner.x, owner.y - 62, 68); this.scene.tweens.add({ targets: effect, scale: 1.15, alpha: 0, duration: 500, onComplete: () => effect.destroy() }); this.showTechniqueLabel(owner.x, owner.y - 130, '간이영역 // DOMAIN NULL') }

  private createHitEffect(x: number, y: number, color: number): void {
    const effect = this.scene.add.graphics(); effect.lineStyle(4, color, 0.95); effect.strokeCircle(x, y, 18)
    this.scene.tweens.add({ targets: effect, scale: 1.6, alpha: 0, duration: 180, onComplete: () => effect.destroy() })
    const text = this.scene.add.text(x, y - 10, 'HIT', { color: '#effcff', fontFamily: 'Space Mono, monospace', fontSize: '12px', stroke: '#06101d', strokeThickness: 3 }).setOrigin(0.5).setDepth(20)
    this.scene.tweens.add({ targets: text, y: y - 40, alpha: 0, duration: 420, onComplete: () => text.destroy() })
  }

  private showTechniqueLabel(x: number, y: number, label: string): void {
    const text = this.scene.add.text(x, y, label, { color: '#f4eaff', fontFamily: 'Space Mono, monospace', fontSize: '10px', fontStyle: 'bold', stroke: '#080b18', strokeThickness: 4 }).setOrigin(0.5).setDepth(20)
    this.scene.tweens.add({ targets: text, y: y - 26, alpha: 0, duration: 620, onComplete: () => text.destroy() })
  }
}
