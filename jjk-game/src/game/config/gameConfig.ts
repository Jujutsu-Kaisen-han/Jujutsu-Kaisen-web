import Phaser from 'phaser'

export const WORLD_WIDTH = 2200
export const WORLD_HEIGHT = 1400

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-canvas',
  backgroundColor: '#07111f',
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 760 },
  render: { antialias: true, pixelArt: false, roundPixels: true },
}
