import Phaser from 'phaser'
import type { Player } from './Player'
import type { Enemy } from './Enemy'
import type { CombatSystem } from '../systems/CombatSystem'

export class Summon extends Phaser.GameObjects.Container {
  readonly expiresAt: number
  attackReadyAt = 0
  private readonly aura: Phaser.GameObjects.Graphics
  private readonly player: Player

  constructor(scene: Phaser.Scene, player: Player, now: number) {
    super(scene, player.x, player.y); this.player = player; this.expiresAt = now + 10000; this.aura = scene.add.graphics()
    this.aura.lineStyle(3, 0x9a8cff, 0.9); this.aura.strokeCircle(0, 0, 31); this.aura.lineStyle(1, 0xd6c7ff, 0.6); this.aura.strokeCircle(0, 0, 39)
    this.add(this.aura); this.setDepth(player.y + 1); scene.add.existing(this)
  }

  updateSummon(now: number, enemies: Enemy[], combat: CombatSystem): boolean {
    this.setPosition(this.player.x + Math.cos(now / 300) * 42, this.player.y + Math.sin(now / 300) * 42).setDepth(this.y + 1)
    if (now >= this.expiresAt) return true
    if (now >= this.attackReadyAt) {
      const target = enemies.filter((enemy) => enemy.state !== 'DEAD').sort((a, b) => Phaser.Math.Distance.Between(this.x, this.y, a.x, a.y) - Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y))[0]
      if (target && Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 280) { this.attackReadyAt = now + 800; combat.summonAttack(this, target) }
    }
    return false
  }
}
