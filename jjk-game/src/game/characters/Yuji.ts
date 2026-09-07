import type Phaser from 'phaser'
import { BaseCharacter } from './BaseCharacter'
export class Yuji extends BaseCharacter { constructor(scene: Phaser.Scene, slot: 'P1' | 'P2', x: number, y: number, facing: 1 | -1) { super(scene, 'yuji', slot, x, y, facing) } }
