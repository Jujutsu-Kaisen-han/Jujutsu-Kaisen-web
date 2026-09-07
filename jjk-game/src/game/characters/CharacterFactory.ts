import Phaser from 'phaser'
import type { CharacterId, PlayerSlot } from '../types/CharacterTypes'
import { BaseCharacter } from './BaseCharacter'
import { Yuta } from './Yuta'
import { Uro } from './Uro'
import { Gojo } from './Gojo'
import { Sukuna } from './Sukuna'
import { Yuji } from './Yuji'
import { Megumi } from './Megumi'

export function createCharacter(scene: Phaser.Scene, id: CharacterId, slot: PlayerSlot, x: number, y: number, facing: 1 | -1): BaseCharacter {
  const constructors = { yuta: Yuta, uro: Uro, gojo: Gojo, sukuna: Sukuna, yuji: Yuji, megumi: Megumi }
  return new constructors[id](scene, slot, x, y, facing)
}
