import Phaser from 'phaser'
import { ARENA_HEIGHT, ARENA_WIDTH, GROUND_Y } from '../config/gameConfig'
import { createCharacter } from '../characters/CharacterFactory'
import type { BaseCharacter } from '../characters/BaseCharacter'
import { CombatSystem } from '../combat/CombatSystem'
import { InputManager, type InputSnapshot } from '../systems/InputManager'
import { RoundManager } from '../systems/RoundManager'
import { YutaSkillSystem } from '../skills/YutaSkillSystem'
import { AIBrain } from '../systems/AIBrain'
import { CooldownSystem } from '../systems/CooldownSystem'
import type { CharacterId, GameMode } from '../types/CharacterTypes'
import type { BattleHudState } from '../types/CombatTypes'

export interface BattleInitData { p1: CharacterId; p2: CharacterId; mode?: GameMode }

export class BattleScene extends Phaser.Scene {
  static readonly key = 'BattleScene'
  private p1!: BaseCharacter
  private p2!: BaseCharacter
  private p1Input!: InputManager
  private p2Input?: InputManager
  private aiBrain?: AIBrain
  private combat!: CombatSystem
  private readonly rounds = new RoundManager()
  private readonly cooldowns = new CooldownSystem()
  private roundStartedAt = 0
  private roundFinished = false
  private roundEndAt = 0
  private matchEndAt = 0
  private p1Id: CharacterId = 'yuta'
  private p2Id: CharacterId = 'yuji'
  private matchOver = false
  private roundMessage = ''
  private matchMessage = ''
  private mode: GameMode = 'local'
  private domainOwner?: BaseCharacter
  private nextDomainStrikeAt = 0
  private yutaSkills!: YutaSkillSystem
  private yutaSwords: Array<{ graphic: Phaser.GameObjects.Graphics; x: number; y: number; triggered: boolean }> = []

  constructor() { super(BattleScene.key) }

  init(data?: BattleInitData): void { this.p1Id = data?.p1 ?? 'yuta'; this.p2Id = data?.p2 ?? 'yuji'; this.mode = data?.mode ?? 'local' }

  create(): void {
    this.drawArena(); this.p1 = createCharacter(this, this.p1Id, 'P1', 390, GROUND_Y, 1); this.p2 = createCharacter(this, this.p2Id, 'P2', 890, GROUND_Y, -1)
    this.p1Input = new InputManager(this, 'P1', 'solo'); if (this.mode === 'local') this.p2Input = new InputManager(this, 'P2'); else this.aiBrain = new AIBrain(this.p2, this.p1)
    this.combat = new CombatSystem(this, (attacker, defender, damage) => { void damage; attacker.ultimate = Math.min(100, attacker.ultimate + 3); defender.ultimate = Math.min(100, defender.ultimate + 1) })
    this.yutaSkills = new YutaSkillSystem(this.combat)
    this.startRound(this.time.now)
  }

  update(time: number, delta: number): void {
    if (this.matchOver) { if (time >= this.matchEndAt) this.events.emit('match-over', { winner: this.rounds.p1Rounds > this.rounds.p2Rounds ? 'P1' : 'P2', p1Rounds: this.rounds.p1Rounds, p2Rounds: this.rounds.p2Rounds }); this.emitHud(time); return }
    if (this.roundFinished) { if (time >= this.roundEndAt && !this.matchOver) { this.rounds.nextRound(); this.startRound(time) } this.emitHud(time); return }
    const leftInput = this.p1Input.read(time); const rightInput = this.mode === 'solo' ? this.aiBrain?.decide(time) ?? this.emptyInput() : this.p2Input?.read(time) ?? this.emptyInput()
    this.p1.updateCharacter(leftInput, time, delta, GROUND_Y, ARENA_WIDTH); this.p2.updateCharacter(rightInput, time, delta, GROUND_Y, ARENA_WIDTH); this.resolveFighterCollision()
    this.processCharacterSkills(this.p1, this.p2, leftInput, time); this.processCharacterSkills(this.p2, this.p1, rightInput, time)
    if (leftInput.ultimatePressed) this.activateDomain(this.p1, this.p2, time)
    if (rightInput.ultimatePressed) this.activateDomain(this.p2, this.p1, time)
    if (leftInput.simpleDomainPressed) this.activateSimpleDomain(this.p1, time)
    if (leftInput.attackPressed) this.combat.attack(this.p1, this.p2, 'basic', time)
    if (leftInput.strongPressed) this.combat.attack(this.p1, this.p2, 'strong', time)
    if (rightInput.attackPressed) this.combat.attack(this.p2, this.p1, 'basic', time)
    if (rightInput.strongPressed) this.combat.attack(this.p2, this.p1, 'strong', time)
    if (this.domainOwner && !this.domainOwner.domainActive(time)) { this.clearYutaSwords(); this.domainOwner = undefined }
    if (this.domainOwner) {
      const target = this.domainOwner === this.p1 ? this.p2 : this.p1
      if (this.domainOwner.definition.id === 'yuta') { this.checkYutaSwordProximity(this.domainOwner, target, time); if (time >= this.nextDomainStrikeAt) { this.combat.guaranteedStrike(this.domainOwner, target, 12, time, '야곱의 사다리 // 필중', true); this.nextDomainStrikeAt = time + 900 } }
      else if (time >= this.nextDomainStrikeAt) { this.combat.domainStrike(this.domainOwner, target, time); this.nextDomainStrikeAt = time + 850 }
    }
    const timeLeft = Math.max(0, 90 - (time - this.roundStartedAt) / 1000)
    if (this.p1.hp <= 0 || this.p2.hp <= 0 || timeLeft <= 0) this.finishRound(this.getRoundWinner(), time)
    this.emitHud(time)
  }

  private startRound(now: number): void {
    this.clearYutaSwords(); this.domainOwner = undefined; this.p1.resetForRound(390, 1); this.p2.resetForRound(890, -1); this.aiBrain?.reset(now); this.roundStartedAt = now; this.roundFinished = false; this.roundMessage = `ROUND ${this.rounds.round}`; this.matchMessage = ''; this.time.delayedCall(900, () => { this.roundMessage = '' })
  }

  private activateSimpleDomain(owner: BaseCharacter, now: number): void {
    if (!owner.activateSimpleDomain(now)) return
    this.cooldowns.start(this.cooldownId(owner, 'simpleDomain'), now, 6500)
    this.combat.simpleDomainEffect(owner)
  }

  private activateDomain(owner: BaseCharacter, opponent: BaseCharacter, now: number): void {
    if (this.domainOwner) return
    if (!owner.activateDomain(now)) return
    this.cooldowns.start(this.cooldownId(owner, 'domain'), now, 15000)
    this.domainOwner = owner; this.nextDomainStrikeAt = now + 450; opponent.hitstunUntil = Math.max(opponent.hitstunUntil, now + 550); opponent.velocityX = 0
    if (owner.definition.id === 'yuta') this.spawnYutaSwords(owner)
    const overlay = this.add.rectangle(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, ARENA_WIDTH, ARENA_HEIGHT, owner.definition.color, 0.13).setDepth(30)
    const frame = this.add.graphics().setDepth(31); frame.lineStyle(3, owner.definition.color, 0.9); frame.strokeRect(28, 78, ARENA_WIDTH - 56, GROUND_Y - 78)
    const label = this.add.text(ARENA_WIDTH / 2, 175, owner.definition.name + ' // 영역전개', { color: owner.definition.accent, fontFamily: 'Space Mono, monospace', fontSize: '17px', fontStyle: 'bold', stroke: '#020711', strokeThickness: 6 }).setOrigin(0.5).setDepth(32)
    this.tweens.add({ targets: [overlay, frame, label], alpha: 0, delay: 5800, duration: 700, onComplete: () => { overlay.destroy(); frame.destroy(); label.destroy() } })
    this.cameras.main.flash(180, 170, 220, 255, false)
  }

  private processCharacterSkills(owner: BaseCharacter, opponent: BaseCharacter, input: InputSnapshot, now: number): void {
    if (owner.definition.id !== 'yuta') return
    if (input.reversePressed && this.cooldowns.ready(this.cooldownId(owner, 'reverse'), now) && this.yutaSkills.reverseTechnique(owner)) this.cooldowns.start(this.cooldownId(owner, 'reverse'), now, 4200)
    const inputs = [input.skill1Pressed, input.skill2Pressed, input.skill3Pressed, input.skill4Pressed, input.skill5Pressed] as const
    inputs.forEach((pressed, index) => {
      const action = `skill${index + 1}` as const
      if (pressed && this.cooldowns.ready(this.cooldownId(owner, action), now) && this.yutaSkills.cast(index as 0 | 1 | 2 | 3 | 4, owner, opponent, now)) this.cooldowns.start(this.cooldownId(owner, action), now, index === 0 ? 2400 : index === 1 ? 8500 : 3200)
    })
  }

  private spawnYutaSwords(owner: BaseCharacter): void {
    this.clearYutaSwords()
    const positions = [owner.x - 170, owner.x - 72, owner.x + 42, owner.x + 152, owner.x + 250].map((x) => Phaser.Math.Clamp(x, 75, ARENA_WIDTH - 75))
    this.yutaSwords = positions.map((x, index) => {
      const y = GROUND_Y - 24 - (index % 2) * 6; const graphic = this.add.graphics().setDepth(8); graphic.lineStyle(4, 0xf4fbff, 0.95); graphic.beginPath(); graphic.moveTo(x, y - 36); graphic.lineTo(x + 11, y + 31); graphic.strokePath(); graphic.lineStyle(2, owner.definition.color, 0.9); graphic.beginPath(); graphic.moveTo(x - 11, y - 3); graphic.lineTo(x + 13, y - 3); graphic.strokePath(); graphic.fillStyle(0xd7c5ff, 0.9); graphic.fillCircle(x, y - 37, 4); return { graphic, x, y, triggered: false }
    })
  }

  private checkYutaSwordProximity(owner: BaseCharacter, opponent: BaseCharacter, now: number): void {
    if (!owner.fullManifestActive(now)) return
    this.yutaSwords.forEach((sword) => {
      if (!sword.triggered && Phaser.Math.Distance.Between(opponent.x, opponent.y - 60, sword.x, sword.y) < 48) { sword.triggered = true; sword.graphic.setAlpha(0.2); this.yutaSkills.useRandomCopy(owner, opponent, now) }
    })
  }

  private clearYutaSwords(): void { this.yutaSwords.forEach((sword) => sword.graphic.destroy()); this.yutaSwords = [] }

  private cooldownId(owner: BaseCharacter, action: string): string { return `${owner.slot}:${action}` }

  private emptyInput(): InputSnapshot { return { left: false, right: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null } }

  private finishRound(winner: 'P1' | 'P2' | 'DRAW', now: number): void {
    if (this.roundFinished) return
    this.roundFinished = true; const result = this.rounds.record(winner); this.roundEndAt = now + 1700; this.roundMessage = winner === 'DRAW' ? 'DRAW ROUND' : `${winner} TAKES THE ROUND`
    if (result.matchOver) { this.matchOver = true; this.matchEndAt = now + 1700; this.matchMessage = winner === 'DRAW' ? 'MATCH DRAW' : `${winner} WINS THE MATCH` }
  }

  private getRoundWinner(): 'P1' | 'P2' | 'DRAW' {
    if (this.p1.hp <= 0 && this.p2.hp <= 0) return 'DRAW'; if (this.p2.hp <= 0) return 'P1'; if (this.p1.hp <= 0) return 'P2'; if (this.p1.hp === this.p2.hp) return 'DRAW'; return this.p1.hp > this.p2.hp ? 'P1' : 'P2'
  }

  private resolveFighterCollision(): void {
    const distance = this.p2.x - this.p1.x; if (Math.abs(distance) >= 44 || Math.abs(this.p2.y - this.p1.y) > 72) return
    const push = (44 - Math.abs(distance)) / 2; if (distance >= 0) { this.p1.x -= push; this.p2.x += push } else { this.p1.x += push; this.p2.x -= push }
  }

  private emitHud(time: number): void {
    if (!this.p1 || !this.p2) return
    const state: BattleHudState = { p1: this.fighterHud(this.p1), p2: this.fighterHud(this.p2), timeLeft: Math.max(0, 90 - (time - this.roundStartedAt) / 1000), round: this.rounds.round, p1Rounds: this.rounds.p1Rounds, p2Rounds: this.rounds.p2Rounds, roundMessage: this.roundMessage, matchMessage: this.matchMessage }
    this.events.emit('hud-update', state)
  }

  private fighterHud(fighter: BaseCharacter): BattleHudState['p1'] {
    const now = this.time.now
    return { name: fighter.definition.name, hp: fighter.hp, maxHp: fighter.definition.stats.maxHp, energy: fighter.energy, maxEnergy: fighter.definition.stats.maxEnergy, ultimate: fighter.ultimate, ultimateReady: fighter.ultimate >= 100, domainActive: fighter.domainActive(now), simpleDomainActive: fighter.simpleDomainActive(now), fullManifestActive: fighter.fullManifestActive(now), guard: fighter.isGuarding, combo: fighter.combo.index, cooldowns: { reverse: this.cooldowns.remaining(this.cooldownId(fighter, 'reverse'), now), skill1: this.cooldowns.remaining(this.cooldownId(fighter, 'skill1'), now), skill2: this.cooldowns.remaining(this.cooldownId(fighter, 'skill2'), now), skill3: this.cooldowns.remaining(this.cooldownId(fighter, 'skill3'), now), skill4: this.cooldowns.remaining(this.cooldownId(fighter, 'skill4'), now), skill5: this.cooldowns.remaining(this.cooldownId(fighter, 'skill5'), now), simpleDomain: this.cooldowns.remaining(this.cooldownId(fighter, 'simpleDomain'), now), domain: this.cooldowns.remaining(this.cooldownId(fighter, 'domain'), now) } }
  }

  private drawArena(): void {
    const background = this.add.graphics(); background.fillStyle(0x071321, 1); background.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT); background.lineStyle(1, 0x15354d, 0.55)
    for (let x = 0; x < ARENA_WIDTH; x += 64) background.lineBetween(x, 80, x, GROUND_Y)
    for (let y = 110; y < GROUND_Y; y += 64) background.lineBetween(0, y, ARENA_WIDTH, y)
    background.fillStyle(0x0b2031, 0.94); background.fillCircle(ARENA_WIDTH / 2, 340, 300)
    background.lineStyle(4, 0x54c4d8, 0.8); background.strokeCircle(ARENA_WIDTH / 2, 340, 300)
    background.lineStyle(1, 0x2e7085, 0.75); background.strokeCircle(ARENA_WIDTH / 2, 340, 284)
    background.fillStyle(0x0d2637, 1); background.fillRect(0, GROUND_Y, ARENA_WIDTH, ARENA_HEIGHT - GROUND_Y); background.lineStyle(3, 0x49b5cf, 0.7); background.lineBetween(0, GROUND_Y, ARENA_WIDTH, GROUND_Y)
    background.lineStyle(2, 0x1e536c, 0.75); background.strokeRect(28, 78, ARENA_WIDTH - 56, GROUND_Y - 78)
    this.add.text(40, 38, 'BINDING VOW // LOCAL DUEL FIELD', { color: '#44748a', fontFamily: 'Space Mono, monospace', fontSize: '11px' })
    this.add.text(ARENA_WIDTH / 2, GROUND_Y - 18, '◈', { color: '#5bb9ce', fontSize: '16px' }).setOrigin(0.5)
  }
}
