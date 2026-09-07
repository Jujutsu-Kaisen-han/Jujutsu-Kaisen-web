import type Phaser from 'phaser'
import { BaseCharacter } from './BaseCharacter'
export class Sukuna extends BaseCharacter { constructor(scene: Phaser.Scene, slot: 'P1' | 'P2', x: number, y: number, facing: 1 | -1) { super(scene, 'sukuna', slot, x, y, facing) } }
