import type { Skill, SkillContext, SkillDefinition } from '../types/SkillTypes'

export abstract class BaseSkill implements Skill {
  readonly definition: SkillDefinition
  constructor(definition: SkillDefinition) { this.definition = definition }
  abstract cast(context: SkillContext): boolean
}
