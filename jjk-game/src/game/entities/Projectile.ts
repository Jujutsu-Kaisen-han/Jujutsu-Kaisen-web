import Phaser from 'phaser'

export class Projectile extends Phaser.GameObjects.Graphics {
  velocityX = 0
  velocityY = 0
  damage = 0
  remaining = 0
  updateProjectile(delta: number): boolean { this.x += this.velocityX * delta / 1000; this.y += this.velocityY * delta / 1000; this.remaining -= delta; return this.remaining <= 0 }
}
