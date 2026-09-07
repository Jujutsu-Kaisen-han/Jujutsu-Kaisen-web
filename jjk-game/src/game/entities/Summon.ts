import Phaser from 'phaser'

export class Summon extends Phaser.GameObjects.Container {
  expiresAt = 0
  constructor(scene: Phaser.Scene, x: number, y: number) { super(scene, x, y); scene.add.existing(this) }
}
