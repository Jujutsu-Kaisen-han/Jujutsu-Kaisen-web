import type Phaser from 'phaser'
import { BaseCharacter } from './BaseCharacter'
export class Yuta extends BaseCharacter { constructor(scene: Phaser.Scene, slot: 'P1' | 'P2', x: number, y: number, facing: 1 | -1) { super(scene, 'yuta', slot, x, y, facing) } }
