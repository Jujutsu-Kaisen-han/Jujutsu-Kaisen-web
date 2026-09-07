import type { PlayerSlot } from './CharacterTypes'

export type AttackKind = 'basic' | 'strong'
export interface HitboxData { owner: PlayerSlot; x: number; y: number; width: number; height: number; damage: number; knockbackX: number; knockbackY: number; activeUntil: number }
export interface HurtboxData { x: number; y: number; width: number; height: number }
export interface BattleHudState { p1: FighterHudState; p2: FighterHudState; timeLeft: number; round: number; p1Rounds: number; p2Rounds: number; roundMessage: string; matchMessage: string }
export interface FighterHudState { name: string; hp: number; maxHp: number; energy: number; maxEnergy: number; ultimate: number; ultimateReady: boolean; domainActive: boolean; fullManifestActive: boolean; guard: boolean; combo: number }
