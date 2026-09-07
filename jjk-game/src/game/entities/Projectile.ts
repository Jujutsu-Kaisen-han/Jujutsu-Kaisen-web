import Phaser from 'phaser'
import type { ProjectileData } from '../types/gameTypes'

export class Projectile extends Phaser.GameObjects.Graphics {
  readonly damage: number; readonly radius: number
  private remainingLife: number
  private readonly velocity: Phaser.Math.Vector2

  constructor(scene: Phaser.Scene, data: ProjectileData) {
    super(scene); this.damage = data.damage; this.radius = data.radius; this.remainingLife = data.life
    this.velocity = new Phaser.Math.Vector2(data.velocity.x, data.velocity.y); this.setPosition(data.position.x, data.position.y)
    this.fillStyle(0x93ecff, 1); this.fillCircle(0, 0, data.radius); this.lineStyle(3, 0x2e9bff, 0.85); this.strokeCircle(0, 0, data.radius + 3)
    this.setDepth(4); scene.add.existing(this)
  }

  updateProjectile(delta: number): boolean { this.x += this.velocity.x * (delta / 1000); this.y += this.velocity.y * (delta / 1000); this.remainingLife -= delta; return this.remainingLife <= 0 }
}
