import type { CharacterId } from '../types/CharacterTypes'
import type { Skill, SkillContext } from '../types/SkillTypes'

export class SkillManager {
  private readonly skills = new Map<CharacterId, Skill[]>()
  register(character: CharacterId, skills: Skill[]): void { this.skills.set(character, skills) }
  cast(character: CharacterId, index: number, context: SkillContext): boolean { return this.skills.get(character)?.[index]?.cast(context) ?? false }
  getSkills(character: CharacterId): Skill[] { return this.skills.get(character) ?? [] }
}
