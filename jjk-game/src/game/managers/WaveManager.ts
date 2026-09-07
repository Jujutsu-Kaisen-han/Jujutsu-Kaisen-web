import Phaser from 'phaser'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'
import { Enemy } from '../entities/Enemy'

export class WaveManager {
  wave = 1
  startWave(scene: Phaser.Scene, wave: number, onSpawn: (enemy: Enemy) => void): void {
    this.wave = wave
    const count = Math.min(5 + (wave - 1) * 2, 14)
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count; const distance = 280 + (index % 3) * 90
      const x = Phaser.Math.Clamp(WORLD_WIDTH / 2 + Math.cos(angle) * distance, 100, WORLD_WIDTH - 100)
      const y = Phaser.Math.Clamp(WORLD_HEIGHT / 2 + Math.sin(angle) * distance, 100, WORLD_HEIGHT - 100)
      onSpawn(new Enemy(scene, x, y, wave, index))
    }
  }
}
