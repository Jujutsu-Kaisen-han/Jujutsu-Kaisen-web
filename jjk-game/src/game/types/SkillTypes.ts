import type { CharacterId, PlayerSlot } from './CharacterTypes'

export interface SkillDefinition { id: string; name: string; key: string; energyCost: number; cooldown: number; description: string }
export interface SkillContext { owner: PlayerSlot; character: CharacterId; now: number }
export interface Skill { readonly definition: SkillDefinition; cast(context: SkillContext): boolean }
