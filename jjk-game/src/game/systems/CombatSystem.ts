import Phaser from 'phaser'
import type { AttackProfile } from '../types/gameTypes'
import type { Enemy } from '../entities/Enemy'
import type { Player } from '../entities/Player'
import type { Summon } from '../entities/Summon'

export class CombatSystem {
  private readonly scene: Phaser.Scene
  private readonly onKill: () => void
  private readonly onPlayerHit: (damage: number) => void

  constructor(scene: Phaser.Scene, onKill: () => void, onPlayerHit: (damage: number) => void) {
    this.scene = scene; this.onKill = onKill; this.onPlayerHit = onPlayerHit
  }

  meleeAttack(player: Player, enemies: Enemy[], profile: AttackProfile): void {
    const power = player.ultimateActive(this.scene.time.now) ? 1.45 : 1
    const direction = new Phaser.Math.Vector2(Math.cos(player.facingAngle), Math.sin(player.facingAngle))
    enemies.forEach((enemy) => {
      if (enemy.state === 'DEAD') return
      const toEnemy = new Phaser.Math.Vector2(enemy.x - player.x, enemy.y - player.y)
      const distance = toEnemy.length()
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(toEnemy.angle() - direction.angle()))
      if (distance <= profile.range + enemy.radius && angleDiff <= profile.arc / 2) {
        const killed = enemy.takeDamage(profile.damage * power, direction.clone().scale(profile.knockback), this.scene.time.now)
        this.showDamage(enemy.x, enemy.y - 28, Math.round(profile.damage * power), profile.color)
        if (killed) this.onKill()
      }
    })
    this.shake(profile.damage > 30 ? 7 : 3)
  }

  skillSlash(player: Player, enemies: Enemy[], radius: number, damage: number): void {
    const power = player.ultimateActive(this.scene.time.now) ? 1.35 : 1
    enemies.forEach((enemy) => {
      if (enemy.state === 'DEAD') return
      const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y)
      if (distance <= radius) {
        const knockback = new Phaser.Math.Vector2(enemy.x - player.x, enemy.y - player.y).normalize().scale(250)
        const killed = enemy.takeDamage(damage * power, knockback, this.scene.time.now)
        this.showDamage(enemy.x, enemy.y - 28, Math.round(damage * power), 0xc998ff)
        if (killed) this.onKill()
      }
    })
    this.createBurst(player.x, player.y, radius); this.shake(10)
  }

  dashAttack(player: Player, enemies: Enemy[], damage: number): void {
    this.meleeAttack(player, enemies, { damage, range: 94, arc: 2.5, knockback: 220, color: 0x73baff })
  }

  summonAttack(summon: Summon, target: Enemy): void {
    const line = this.scene.add.graphics(); line.lineStyle(5, 0xc8b8ff, 0.8); line.beginPath(); line.moveTo(summon.x, summon.y); line.lineTo(target.x, target.y); line.strokePath()
    this.scene.tweens.add({ targets: line, alpha: 0, duration: 220, onComplete: () => line.destroy() })
    const killed = target.takeDamage(24, new Phaser.Math.Vector2(target.x - summon.x, target.y - summon.y).normalize().scale(90), this.scene.time.now)
    this.showDamage(target.x, target.y - 28, 24, 0xd6c7ff); if (killed) this.onKill()
  }

  damagePlayer(player: Player, damage: number): void {
    if (player.takeDamage(damage, this.scene.time.now)) { this.onPlayerHit(damage); this.showDamage(player.x, player.y - 35, damage, 0xff7196); this.shake(6) }
  }

  createSlashEffect(x: number, y: number, angle: number, profile: AttackProfile): void {
    const slash = this.scene.add.graphics(); slash.lineStyle(7, profile.color, 0.92); slash.beginPath(); slash.arc(x, y, profile.range, angle - profile.arc / 2, angle + profile.arc / 2); slash.strokePath()
    this.scene.tweens.add({ targets: slash, alpha: 0, scale: 1.08, duration: 160, onComplete: () => slash.destroy() })
  }

  private createBurst(x: number, y: number, radius: number): void {
    const burst = this.scene.add.graphics(); burst.lineStyle(5, 0xc998ff, 0.9); burst.strokeCircle(x, y, radius * 0.8)
    this.scene.tweens.add({ targets: burst, alpha: 0, scale: 1.2, duration: 260, onComplete: () => burst.destroy() })
  }

  private showDamage(x: number, y: number, value: number, color: number): void {
    const text = this.scene.add.text(x, y, `${value}`, { color: `#${color.toString(16).padStart(6, '0')}`, fontFamily: 'Arial Black, sans-serif', fontSize: '18px', stroke: '#080b18', strokeThickness: 4 }).setOrigin(0.5).setDepth(20)
    this.scene.tweens.add({ targets: text, y: y - 36, alpha: 0, duration: 560, ease: 'Cubic.easeOut', onComplete: () => text.destroy() })
  }

  private shake(intensity: number): void { this.scene.cameras.main.shake(110, intensity / 1000) }
}
