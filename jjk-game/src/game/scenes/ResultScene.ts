import Phaser from 'phaser'

export class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene') }
  create(data: { winner?: string }): void { this.add.text(640, 350, data.winner ? `${data.winner} WINS` : 'MATCH COMPLETE', { color: '#ffffff', fontFamily: 'monospace', fontSize: '24px' }).setOrigin(0.5) }
}
