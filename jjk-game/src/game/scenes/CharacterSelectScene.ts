import Phaser from 'phaser'

export class CharacterSelectScene extends Phaser.Scene {
  constructor() { super('CharacterSelectScene') }
  create(): void { this.add.text(640, 350, 'CHARACTER SELECT IS CONTROLLED BY REACT UI', { color: '#73e6ff', fontFamily: 'monospace', fontSize: '18px' }).setOrigin(0.5) }
}
