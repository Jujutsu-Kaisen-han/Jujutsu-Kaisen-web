import Phaser from 'phaser'

export class Summon extends Phaser.GameObjects.Container {
  expiresAt = 0
  constructor(scene: Phaser.Scene, x: number, y: number) { super(scene, x, y); scene.add.existing(this) }
}

export class RikaSummon extends Summon {
  private readonly auraGraphic: Phaser.GameObjects.Graphics
  private readonly bodyGraphic: Phaser.GameObjects.Graphics
  private readonly attackGraphic: Phaser.GameObjects.Graphics
  private attackingUntil = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.auraGraphic = scene.add.graphics(); this.bodyGraphic = scene.add.graphics(); this.attackGraphic = scene.add.graphics()
    this.add([this.auraGraphic, this.bodyGraphic, this.attackGraphic]); this.setDepth(y + 4)
    this.drawBody()
  }

  follow(ownerX: number, ownerY: number, facing: 1 | -1, now: number, arenaWidth: number): void {
    const targetX = Phaser.Math.Clamp(ownerX + facing * 86, 48, arenaWidth - 48)
    this.x = Phaser.Math.Linear(this.x, targetX, 0.22); this.y = ownerY - 4 + Math.sin(now * 0.006) * 5; this.setDepth(ownerY + 4)
    this.auraGraphic.clear(); this.attackGraphic.clear()
    this.auraGraphic.lineStyle(3, 0xd9c2ff, 0.45); this.auraGraphic.strokeCircle(0, -67, 43 + Math.sin(now * 0.008) * 3)
    if (now < this.attackingUntil) { this.attackGraphic.lineStyle(6, 0xf3eaff, 0.9); this.attackGraphic.beginPath(); this.attackGraphic.arc(facing * 22, -70, 66, facing > 0 ? -1.25 : 1.9, facing > 0 ? 1.25 : 4.35, facing < 0); this.attackGraphic.strokePath() }
  }

  triggerAttack(now: number): void { this.attackingUntil = now + 260 }

  private drawBody(): void {
    this.bodyGraphic.fillStyle(0x120d24, 0.95); this.bodyGraphic.fillEllipse(0, -67, 62, 84)
    this.bodyGraphic.fillStyle(0xe9ddff, 0.94); this.bodyGraphic.fillEllipse(0, -70, 49, 73)
    this.bodyGraphic.lineStyle(3, 0xffffff, 0.8); this.bodyGraphic.strokeEllipse(0, -70, 49, 73)
    this.bodyGraphic.fillStyle(0x24133b, 1); this.bodyGraphic.fillCircle(-12, -77, 6); this.bodyGraphic.fillCircle(12, -77, 6)
    this.bodyGraphic.fillStyle(0xffd5ee, 1); this.bodyGraphic.fillCircle(-11, -78, 2); this.bodyGraphic.fillCircle(13, -78, 2)
    this.bodyGraphic.lineStyle(4, 0xd9c2ff, 0.9); this.bodyGraphic.beginPath(); this.bodyGraphic.moveTo(-20, -38); this.bodyGraphic.lineTo(-35, -12); this.bodyGraphic.moveTo(20, -38); this.bodyGraphic.lineTo(35, -12); this.bodyGraphic.strokePath()
    this.bodyGraphic.fillStyle(0x7e5aa8, 0.9); this.bodyGraphic.fillEllipse(0, -38, 28, 9)
  }
}
