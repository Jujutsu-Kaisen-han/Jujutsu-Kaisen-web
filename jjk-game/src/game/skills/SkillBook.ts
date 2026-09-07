import Phaser from 'phaser'
import type { Skill, SkillContext } from './Skill'
import type { SkillDefinition, SkillKey, Vector2 } from '../types/gameTypes'
import type { Enemy } from '../entities/Enemy'
import type { Player } from '../entities/Player'
import type { CombatSystem } from '../systems/CombatSystem'
import type { Projectile } from '../entities/Projectile'
import { Projectile as ProjectileEntity } from '../entities/Projectile'
import { Summon } from '../entities/Summon'

const DEFINITIONS: SkillDefinition[] = [
  { key: 'Q', label: 'Q', name: 'CURSED SLASH', cooldown: 2600, energyCost: 18, description: 'Launch a focused blade wave.' },
  { key: 'E', label: 'E', name: 'FLASH STEP', cooldown: 4200, energyCost: 24, description: 'Dash forward and cut through foes.' },
  { key: 'R', label: 'R', name: 'RING OF LIGHT', cooldown: 7200, energyCost: 36, description: 'Strike every nearby enemy.' },
  { key: 'F', label: 'F', name: 'RIKA // MANIFEST', cooldown: 16000, energyCost: 62, description: 'Summon a powerful autonomous ally.' },
]

export class SkillBook {
  readonly skills: Skill[]
  readonly cooldowns = new Map<SkillKey, number>()
  private readonly scene: Phaser.Scene
  private readonly player: Player
  private readonly getEnemies: () => Enemy[]
  private readonly combat: CombatSystem
  private readonly getAim: () => Vector2
  private readonly addProjectile: (projectile: Projectile) => void
  private readonly getObstacles: () => Phaser.Geom.Rectangle[]
  private readonly setSummon: (summon: Summon) => void

  constructor(scene: Phaser.Scene, player: Player, getEnemies: () => Enemy[], combat: CombatSystem, getAim: () => Vector2, addProjectile: (projectile: Projectile) => void, getObstacles: () => Phaser.Geom.Rectangle[], setSummon: (summon: Summon) => void) {
    this.scene = scene; this.player = player; this.getEnemies = getEnemies; this.combat = combat; this.getAim = getAim; this.addProjectile = addProjectile; this.getObstacles = getObstacles; this.setSummon = setSummon
    this.skills = DEFINITIONS.map((definition) => ({ definition, cast: (context: SkillContext) => this.castDefinition(definition, context) }))
  }

  cast(key: SkillKey, now: number): boolean { return this.skills.find((item) => item.definition.key === key)?.cast({ now }) ?? false }
  getRemaining(key: SkillKey, now: number): number { return this.player.getCooldownMs(key, now, this.cooldowns) }
  isReady(key: SkillKey, now: number): boolean {
    const skill = this.skills.find((item) => item.definition.key === key)
    return skill ? this.getRemaining(key, now) <= 0 && this.player.energy >= skill.definition.energyCost : false
  }

  private castDefinition(definition: SkillDefinition, context: SkillContext): boolean {
    if (!this.isReady(definition.key, context.now) || !this.player.spendEnergy(definition.energyCost)) return false
    this.cooldowns.set(definition.key, context.now + definition.cooldown)
    const enemies = this.getEnemies(); const aim = new Phaser.Math.Vector2(this.getAim().x - this.player.x, this.getAim().y - this.player.y).normalize()
    if (definition.key === 'Q') {
      const projectile = new ProjectileEntity(this.scene, { position: { x: this.player.x, y: this.player.y }, velocity: { x: aim.x * 560, y: aim.y * 560 }, damage: 30, radius: 11, life: 1400 })
      this.addProjectile(projectile)
    } else if (definition.key === 'E') {
      this.player.startDash(context.now, this.getAim(), this.getObstacles()); this.combat.dashAttack(this.player, enemies, 34)
    } else if (definition.key === 'R') {
      this.combat.skillSlash(this.player, enemies, 170, 48)
    } else if (definition.key === 'F') {
      this.player.activateUltimate(context.now); this.setSummon(new Summon(this.scene, this.player, context.now)); this.combat.skillSlash(this.player, enemies, 110, 22)
    }
    return true
  }
}
