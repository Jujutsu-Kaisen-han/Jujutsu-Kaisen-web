import Phaser from 'phaser'

export const ARENA_WIDTH = 1280
export const ARENA_HEIGHT = 720
export const ARENA_CENTER_X = ARENA_WIDTH / 2
export const ARENA_CENTER_Y = ARENA_HEIGHT / 2
export const ARENA_RADIUS = 294
export const CHARACTER_BASE_OFFSET = 62
export const GROUND_Y = ARENA_CENTER_Y + CHARACTER_BASE_OFFSET

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-canvas',
  backgroundColor: '#060d1a',
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: ARENA_WIDTH, height: ARENA_HEIGHT },
  render: { antialias: true, pixelArt: false, roundPixels: true },
}
