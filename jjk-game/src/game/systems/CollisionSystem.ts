import Phaser from 'phaser'
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig'

export function resolveCircleMovement(position: Phaser.Math.Vector2, delta: Phaser.Math.Vector2, radius: number, obstacles: Phaser.Geom.Rectangle[]): Phaser.Math.Vector2 {
  const next = position.clone().add(delta)
  next.x = Phaser.Math.Clamp(next.x, radius + 24, WORLD_WIDTH - radius - 24)
  next.y = Phaser.Math.Clamp(next.y, radius + 24, WORLD_HEIGHT - radius - 24)
  obstacles.forEach((obstacle) => {
    const closestX = Phaser.Math.Clamp(next.x, obstacle.left, obstacle.right)
    const closestY = Phaser.Math.Clamp(next.y, obstacle.top, obstacle.bottom)
    const pushX = next.x - closestX
    const pushY = next.y - closestY
    const distance = Math.hypot(pushX, pushY)
    if (distance < radius) {
      const length = distance || 1
      next.x = closestX + (pushX / length) * radius
      next.y = closestY + (pushY / length) * radius
    }
  })
  return next
}

export function isInsideWorld(x: number, y: number, margin = 0): boolean {
  return x > margin && x < WORLD_WIDTH - margin && y > margin && y < WORLD_HEIGHT - margin
}
