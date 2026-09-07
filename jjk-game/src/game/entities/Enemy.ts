import Phaser from 'phaser'
import type { EnemyState, Vector2 } from '../types/gameTypes'
import { resolveCircleMovement } from '../systems/CollisionSystem'
import type { Player } from './Player'

export class Enemy extends Phaser.GameObjects.Container {
  readonly radius = 18
  readonly maxHp: number
  readonly damage: number
  hp: number
  state: EnemyState = 'IDLE'
  attackReadyAt = 0
  hitUntil = 0
  private readonly bodyGraphic: Phaser.GameObjects.Graphics
  private readonly hpBar: Phaser.GameObjects.Graphics
  private knockback: Vector2 = { x: 0, y: 0 }

  constructor(scene: Phaser.Scene, x: number, y: number, wave: number, variant: number) {
    super(scene, x, y)
    this.maxHp = 54 + (wave - 1) * 15; this.damage = 8 + (wave - 1) * 2; this.hp = this.maxHp
    this.bodyGraphic = scene.add.graphics(); const colors = [0x3b2e63, 0x51355f, 0x263c63]
    this.bodyGraphic.fillStyle(colors[variant % colors.length], 1); this.bodyGraphic.fillCircle(0, 0, 18)
    this.bodyGraphic.lineStyle(2, 0x9c7bbb, 0.75); this.bodyGraphic.strokeCircle(0, 0, 18)
    this.bodyGraphic.fillStyle(0xff789b, 1); this.bodyGraphic.fillCircle(6, -5, 3); this.bodyGraphic.fillCircle(-5, -5, 3)
    this.hpBar = scene.add.graphics(); this.add([this.bodyGraphic, this.hpBar]); this.setSize(36, 36).setDepth(y); scene.add.existing(this)
  }

  updateAI(player: Player, now: number, delta: number, obstacles: Phaser.Geom.Rectangle[]): boolean {
    if (this.state === 'DEAD') return false
    if (this.state === 'HIT') {
      if (now < this.hitUntil) {
        const push = new Phaser.Math.Vector2(this.knockback.x, this.knockback.y).scale(delta / 1000)
        const next = resolveCircleMovement(new Phaser.Math.Vector2(this.x, this.y), push, this.radius, obstacles)
        this.setPosition(next.x, next.y); this.knockback.x *= 0.88; this.knockback.y *= 0.88; return false
      }
      this.state = 'CHASE'
    }
    const toPlayer = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y); const distance = toPlayer.length()
    if (distance > 680) this.state = 'IDLE'; else if (distance > 74) this.state = 'CHASE'; else this.state = 'ATTACK'
    if (this.state === 'CHASE') {
      const next = resolveCircleMovement(new Phaser.Math.Vector2(this.x, this.y), toPlayer.normalize().scale(92 * (delta / 1000)), this.radius, obstacles)
      this.setPosition(next.x, next.y)
    }
    this.setDepth(this.y)
    if (this.state === 'ATTACK' && now >= this.attackReadyAt) { this.attackReadyAt = now + 1050; return true }
    return false
  }

  takeDamage(amount: number, knockback: Vector2, now: number): boolean {
    if (this.state === 'DEAD') return false
    this.hp = Math.max(0, this.hp - amount); this.knockback = { x: knockback.x, y: knockback.y }; this.hitUntil = now + 170
    this.state = this.hp <= 0 ? 'DEAD' : 'HIT'; this.bodyGraphic.setAlpha(this.state === 'DEAD' ? 0 : 1); this.drawHealthBar()
    return this.state === 'DEAD'
  }

  private drawHealthBar(): void {
    this.hpBar.clear(); if (this.hp >= this.maxHp || this.state === 'DEAD') return
    this.hpBar.fillStyle(0x130f22, 0.95); this.hpBar.fillRect(-22, -31, 44, 5)
    this.hpBar.fillStyle(0xff6f92, 1); this.hpBar.fillRect(-21, -30, 42 * (this.hp / this.maxHp), 3)
  }
}
