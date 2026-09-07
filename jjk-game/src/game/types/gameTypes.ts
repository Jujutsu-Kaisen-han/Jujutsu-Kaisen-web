export type EnemyState = 'IDLE' | 'CHASE' | 'ATTACK' | 'HIT' | 'DEAD'
export type SkillKey = 'Q' | 'E' | 'R' | 'F'

export interface Vector2 { x: number; y: number }

export interface HudState {
  hp: number
  maxHp: number
  energy: number
  maxEnergy: number
  kills: number
  wave: number
  enemiesRemaining: number
  ultimateRemaining: number
  cooldowns: Record<SkillKey, number>
  ready: Record<SkillKey, boolean>
  playerFacing: number
}

export interface SkillDefinition {
  key: SkillKey
  label: string
  name: string
  cooldown: number
  energyCost: number
  description: string
}

export interface AttackProfile { damage: number; range: number; arc: number; knockback: number; color: number }
export interface ProjectileData { position: Vector2; velocity: Vector2; damage: number; radius: number; life: number }
