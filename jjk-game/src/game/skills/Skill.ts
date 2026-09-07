import type { SkillDefinition } from '../types/gameTypes'

export interface SkillContext { now: number }
export interface Skill { readonly definition: SkillDefinition; cast(context: SkillContext): boolean }
