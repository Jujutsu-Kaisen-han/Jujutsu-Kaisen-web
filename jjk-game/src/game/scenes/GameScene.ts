import Phaser from 'phaser'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { InputManager } from '../managers/InputManager'
import { WaveManager } from '../managers/WaveManager'
import { Player } from '../entities/Player'
import { Enemy } from '../entities/Enemy'
import { Projectile } from '../entities/Projectile'
import { Summon } from '../entities/Summon'
import { CombatSystem } from '../systems/CombatSystem'
import { SkillBook } from '../skills/SkillBook'
import { isInsideWorld } from '../systems/CollisionSystem'
import type { HudState, SkillKey } from '../types/gameTypes'

export class GameScene extends Phaser.Scene {
  static readonly key = 'GameScene'
  player!: Player
  private controls!: InputManager
  private combat!: CombatSystem
  private skillBook!: SkillBook
  private waveManager!: WaveManager
  private enemies: Enemy[] = []
  private projectiles: Projectile[] = []
  private summon?: Summon
  private obstacles: Phaser.Geom.Rectangle[] = []
  private kills = 0
  private waveBanner?: Phaser.GameObjects.Text
  private nextWaveAt = 0
  private waveClearPending = false
  private gameOver = false

  constructor() { super(GameScene.key) }

  create(): void {
    this.gameOver = false; this.kills = 0; this.enemies = []; this.projectiles = []; this.waveClearPending = false; this.nextWaveAt = 0
    this.drawArena(); this.controls = new InputManager(this); this.player = new Player(this, WORLD_WIDTH / 2, WORLD_HEIGHT / 2)
    this.combat = new CombatSystem(this, () => { this.kills += 1 }, () => undefined)
    this.waveManager = new WaveManager()
    this.skillBook = new SkillBook(this, this.player, () => this.enemies, this.combat, () => this.controls.pointerWorld, (projectile) => this.projectiles.push(projectile), () => this.obstacles, (summon) => { this.summon?.destroy(); this.summon = summon })
    this.waveManager.startWave(this, 1, (enemy) => this.enemies.push(enemy)); this.showWaveBanner('WAVE 01  //  FIRST EXORCISM')
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT); this.cameras.main.startFollow(this.player, true, 0.08, 0.08); this.emitHud()
  }

  update(time: number, delta: number): void {
    if (this.gameOver) return
    this.controls.update(); this.player.updateMovement(this.controls.movement, this.controls.pointerWorld, time, delta, this.obstacles)
    if (this.controls.consumeAttack()) this.player.tryBasicAttack(time, this.enemies, this.combat)
    if (this.controls.consumeSkill('SPACE')) this.player.startDash(time, this.controls.pointerWorld, this.obstacles)
    if (this.controls.consumeSkill('Q')) this.skillBook.cast('Q', time)
    if (this.controls.consumeSkill('E')) this.skillBook.cast('E', time)
    if (this.controls.consumeSkill('R')) this.skillBook.cast('R', time)
    if (this.controls.consumeSkill('F')) this.skillBook.cast('F', time)
    this.player.recoverEnergy(delta * 0.012); this.updateEnemies(time, delta); this.updateProjectiles(time, delta)
    if (this.summon && this.summon.updateSummon(time, this.enemies, this.combat)) { this.summon.destroy(); this.summon = undefined }
    this.cleanDeadEnemies()
    if (this.enemies.length === 0 && !this.waveClearPending) { this.waveClearPending = true; this.nextWaveAt = time + 1800 }
    if (this.player.hp <= 0) this.endGame()
    if (!this.gameOver && this.waveClearPending && time >= this.nextWaveAt) { this.waveClearPending = false; this.waveManager.startWave(this, this.waveManager.wave + 1, (enemy) => this.enemies.push(enemy)); this.showWaveBanner(`WAVE ${this.waveManager.wave.toString().padStart(2, '0')}  //  THREAT ESCALATION`) }
    this.emitHud()
  }

  private updateEnemies(time: number, delta: number): void { this.enemies.forEach((enemy) => { if (enemy.updateAI(this.player, time, delta, this.obstacles)) this.combat.damagePlayer(this.player, enemy.damage) }) }

  private updateProjectiles(time: number, delta: number): void {
    this.projectiles = this.projectiles.filter((projectile) => {
      const expired = projectile.updateProjectile(delta) || !isInsideWorld(projectile.x, projectile.y, 40)
      if (expired) { projectile.destroy(); return false }
      const target = this.enemies.find((enemy) => enemy.state !== 'DEAD' && Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) <= projectile.radius + enemy.radius)
      if (!target) return true
      const killed = target.takeDamage(projectile.damage, new Phaser.Math.Vector2(projectile.x - target.x, projectile.y - target.y).normalize().scale(90), time)
      this.showProjectileImpact(projectile.x, projectile.y); if (killed) this.kills += 1; projectile.destroy(); return false
    })
  }

  private cleanDeadEnemies(): void {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.state !== 'DEAD') return true
      this.tweens.add({ targets: enemy, scale: 1.45, alpha: 0, duration: 260, onComplete: () => enemy.destroy() }); return false
    })
  }

  private endGame(): void { this.gameOver = true; this.events.emit('game-over') }

  private emitHud(): void {
    const now = this.time.now; const keys: SkillKey[] = ['Q', 'E', 'R', 'F']
    const cooldowns = Object.fromEntries(keys.map((key) => [key, this.skillBook ? this.skillBook.getRemaining(key, now) : 0])) as Record<SkillKey, number>
    const ready = Object.fromEntries(keys.map((key) => [key, this.skillBook ? this.skillBook.isReady(key, now) : false])) as Record<SkillKey, boolean>
    const state: HudState = { hp: this.player.hp, maxHp: this.player.maxHp, energy: this.player.energy, maxEnergy: this.player.maxEnergy, kills: this.kills, wave: this.waveManager.wave, enemiesRemaining: this.enemies.length, ultimateRemaining: Math.max(0, this.player.ultimateUntil - now), cooldowns, ready, playerFacing: this.player.facingAngle }
    this.events.emit('hud-update', state)
  }

  private drawArena(): void {
    const background = this.add.graphics(); background.fillStyle(0x081424, 1); background.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT); background.lineStyle(1, 0x132c45, 0.6)
    for (let x = 0; x <= WORLD_WIDTH; x += 80) background.lineBetween(x, 0, x, WORLD_HEIGHT)
    for (let y = 0; y <= WORLD_HEIGHT; y += 80) background.lineBetween(0, y, WORLD_WIDTH, y)
    background.lineStyle(3, 0x24516c, 0.75); background.strokeRect(24, 24, WORLD_WIDTH - 48, WORLD_HEIGHT - 48)
    const obstacleData = [new Phaser.Geom.Rectangle(430, 330, 260, 56), new Phaser.Geom.Rectangle(1540, 310, 240, 60), new Phaser.Geom.Rectangle(540, 1000, 350, 58), new Phaser.Geom.Rectangle(1380, 930, 300, 58), new Phaser.Geom.Rectangle(965, 470, 270, 52)]
    this.obstacles = obstacleData
    obstacleData.forEach((obstacle) => { background.fillStyle(0x102b3a, 1); background.fillRoundedRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 10); background.lineStyle(2, 0x27617a, 0.9); background.strokeRoundedRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 10) })
    this.add.text(52, 48, 'SECTOR 01  /  HIDDEN TRAINING GROUND', { color: '#37647d', fontFamily: 'monospace', fontSize: '13px' }).setDepth(2)
  }

  private showWaveBanner(message: string): void {
    this.waveBanner?.destroy(); this.waveBanner = this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, message, { color: '#bfeeff', fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', stroke: '#07111f', strokeThickness: 8 }).setOrigin(0.5).setScrollFactor(0).setDepth(50)
    this.tweens.add({ targets: this.waveBanner, alpha: 0, delay: 1150, duration: 700, onComplete: () => this.waveBanner?.destroy() })
  }

  private showProjectileImpact(x: number, y: number): void {
    const impact = this.add.graphics(); impact.lineStyle(3, 0x8de7ff, 0.9); impact.strokeCircle(x, y, 18); this.tweens.add({ targets: impact, scale: 1.6, alpha: 0, duration: 200, onComplete: () => impact.destroy() })
  }
}
