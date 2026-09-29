import Phaser from 'phaser'
import { ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_HEIGHT, ARENA_RADIUS, ARENA_WIDTH, CHARACTER_BASE_OFFSET } from '../config/gameConfig'
import { createCharacter } from '../characters/CharacterFactory'
import type { BaseCharacter } from '../characters/BaseCharacter'
import { CombatSystem } from '../combat/CombatSystem'
import { InputManager, type InputSnapshot } from '../systems/InputManager'
import { RoundManager } from '../systems/RoundManager'
import { YutaSkillSystem } from '../skills/YutaSkillSystem'
import { CharacterSkillSystem } from '../skills/CharacterSkillSystem'
import { AIBrain } from '../systems/AIBrain'
import { CooldownSystem } from '../systems/CooldownSystem'
import { RikaSummon } from '../entities/Summon'
import type { CharacterId, GameMode } from '../types/CharacterTypes'
import type { BattleHudState } from '../types/CombatTypes'
import type { PlayerSlot } from '../types/CharacterTypes'
import type { OnlineClient } from '../network/OnlineClient'
import { DomainClashSystem, type DomainClashWinner } from '../systems/DomainClashSystem'
import { CHARACTER_PORTRAIT_URLS, characterPortraitKey } from '../config/characterPortraits'

export interface BattleInitData { p1: CharacterId; p2: CharacterId; mode?: GameMode; onlineRole?: PlayerSlot; onlineClient?: OnlineClient }

export class BattleScene extends Phaser.Scene {
  static readonly key = 'BattleScene'
  private p1!: BaseCharacter
  private p2!: BaseCharacter
  private p1Input?: InputManager
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
  private onlineRole?: PlayerSlot
  private onlineClient?: OnlineClient
  private domainOwner?: BaseCharacter
  private domainClashUntil = 0
  private domainClashParticipants?: [BaseCharacter, BaseCharacter]
  private domainClashRemaining?: [number, number]
  private readonly domainClashGauge = new DomainClashSystem()
  private domainClashGraphic?: Phaser.GameObjects.Graphics
  private domainClashLabel?: Phaser.GameObjects.Text
  private nextDomainStrikeAt = 0
  private yutaSkills!: YutaSkillSystem
  private characterSkills!: CharacterSkillSystem
  private yutaSwords: Array<{ graphic: Phaser.GameObjects.Graphics; x: number; y: number; triggered: boolean }> = []
  private readonly rikaSummons: Partial<Record<'P1' | 'P2', RikaSummon>> = {}
  private readonly nextRikaAttackAt: Record<'P1' | 'P2', number> = { P1: 0, P2: 0 }
  private readonly nextMahoragaAttackAt: Record<'P1' | 'P2', number> = { P1: 0, P2: 0 }

  constructor() { super(BattleScene.key) }

  init(data?: BattleInitData): void { this.p1Id = data?.p1 ?? 'yuta'; this.p2Id = data?.p2 ?? 'yuji'; this.mode = data?.mode ?? 'local'; this.onlineRole = data?.onlineRole; this.onlineClient = data?.onlineClient }

  preload(): void {
    this.load.setCORS('anonymous')
    Object.entries(CHARACTER_PORTRAIT_URLS).forEach(([id, url]) => {
      this.load.image(characterPortraitKey(id as CharacterId), url)
    })
  }

  create(): void {
    this.drawArena(); this.p1 = createCharacter(this, this.p1Id, 'P1', ARENA_CENTER_X - 190, ARENA_CENTER_Y + CHARACTER_BASE_OFFSET, 1); this.p2 = createCharacter(this, this.p2Id, 'P2', ARENA_CENTER_X + 190, ARENA_CENTER_Y + CHARACTER_BASE_OFFSET, -1); this.p2.aiControlled = this.mode === 'solo'
    this.p1Input = this.mode !== 'online' || this.onlineRole === 'P1' ? new InputManager(this, 'P1', 'solo') : undefined
    this.p2Input = this.mode === 'local' || (this.mode === 'online' && this.onlineRole === 'P2') ? new InputManager(this, 'P2') : undefined
    if (this.mode === 'solo') this.aiBrain = new AIBrain(this.p2, this.p1)
    this.combat = new CombatSystem(this, (attacker, defender, damage) => {
      if (this.domainClashUntil > this.time.now) {
        const result = this.domainClashGauge.applyHit(attacker.slot, damage)
        if (result.winner) this.resolveDomainClash(this.time.now, result.winner)
      }
      attacker.ultimate = Math.min(100, attacker.ultimate + 3); defender.ultimate = Math.min(100, defender.ultimate + 1)
    })
    this.yutaSkills = new YutaSkillSystem(this.combat)
    this.characterSkills = new CharacterSkillSystem(this.combat)
    this.startRound(this.time.now)
  }

  update(time: number, delta: number): void {
    if (this.matchOver) { if (time >= this.matchEndAt) this.events.emit('match-over', { winner: this.getMatchWinner(), p1Rounds: this.rounds.p1Rounds, p2Rounds: this.rounds.p2Rounds }); this.emitHud(time); return }
    if (this.roundFinished) { if (time >= this.roundEndAt && !this.matchOver) { this.rounds.nextRound(); this.startRound(time) } this.emitHud(time); return }
    let leftInput: InputSnapshot
    let rightInput: InputSnapshot
    if (this.mode === 'online') {
      const localInput = (this.onlineRole === 'P2' ? this.p2Input?.read(time) : this.p1Input?.read(time)) ?? this.emptyInput()
      this.onlineClient?.sendInput(localInput)
      const remoteInput = this.onlineClient?.consumeRemoteInput() ?? this.emptyInput()
      leftInput = this.onlineRole === 'P2' ? remoteInput : localInput
      rightInput = this.onlineRole === 'P2' ? localInput : remoteInput
    } else {
      leftInput = this.p1Input?.read(time) ?? this.emptyInput()
      rightInput = this.mode === 'solo' ? this.aiBrain?.decide(time) ?? this.emptyInput() : this.p2Input?.read(time) ?? this.emptyInput()
    }
    this.p1.updateCharacter(leftInput, time, delta, ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS); this.p2.updateCharacter(rightInput, time, delta, ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS); this.resolveFighterCollision()
    this.yutaSkills.update(this.p1, time); this.yutaSkills.update(this.p2, time)
    this.processCharacterSkills(this.p1, this.p2, leftInput, time); this.processCharacterSkills(this.p2, this.p1, rightInput, time)
    this.updateRikaSummons(time)
    this.updateMahoragaSupport(time)
    if (leftInput.ultimatePressed) this.activateDomain(this.p1, this.p2, time)
    if (rightInput.ultimatePressed) this.activateDomain(this.p2, this.p1, time)
    if (leftInput.simpleDomainPressed) this.activateSimpleDomain(this.p1, time)
    if (rightInput.simpleDomainPressed) this.activateSimpleDomain(this.p2, time)
    if (leftInput.attackPressed) this.combat.attack(this.p1, this.p2, 'basic', time)
    if (leftInput.strongPressed) this.combat.attack(this.p1, this.p2, 'strong', time)
    if (rightInput.attackPressed) this.combat.attack(this.p2, this.p1, 'basic', time)
    if (rightInput.strongPressed) this.combat.attack(this.p2, this.p1, 'strong', time)
    if (this.domainClashUntil > 0 && (time >= this.domainClashUntil || this.p1.hp <= 0 || this.p2.hp <= 0)) this.resolveDomainClash(time)
    if (this.domainOwner && !this.domainOwner.domainActive(time)) { this.domainOwner.blockDomain(time); this.clearYutaSwords(); this.domainOwner = undefined }
    if (this.domainOwner) {
      const target = this.domainOwner === this.p1 ? this.p2 : this.p1
      if (this.domainOwner.definition.id === 'yuta') { this.checkYutaSwordProximity(this.domainOwner, target, time); if (time >= this.nextDomainStrikeAt) { this.combat.guaranteedStrike(this.domainOwner, target, 12, time, '야곱의 사다리 // 필중', true); this.nextDomainStrikeAt = time + 900 } }
      else if (this.domainOwner.definition.id !== 'gojo' && time >= this.nextDomainStrikeAt) { this.combat.domainStrike(this.domainOwner, target, time); this.nextDomainStrikeAt = time + (this.domainOwner.definition.id === 'sukuna' ? 460 : 850) }
    }
    const timeLeft = Math.max(0, 90 - (time - this.roundStartedAt) / 1000)
    if (this.p1.hp <= 0 || this.p2.hp <= 0 || timeLeft <= 0) this.finishRound(this.getRoundWinner(), time)
    this.emitHud(time)
  }

  private startRound(now: number): void {
    this.clearYutaSwords(); this.clearRikaSummons(); this.clearDomainClash(); this.domainOwner = undefined; this.domainClashUntil = 0; this.domainClashParticipants = undefined; this.domainClashRemaining = undefined; this.domainClashGauge.reset(); this.p1.resetForRound(ARENA_CENTER_X - 190, ARENA_CENTER_Y + CHARACTER_BASE_OFFSET, 1); this.p2.resetForRound(ARENA_CENTER_X + 190, ARENA_CENTER_Y + CHARACTER_BASE_OFFSET, -1); this.aiBrain?.reset(now); this.roundStartedAt = now; this.roundFinished = false; this.roundMessage = `ROUND ${this.rounds.round}`; this.matchMessage = ''; this.time.delayedCall(900, () => { this.roundMessage = '' })
  }

  private activateSimpleDomain(owner: BaseCharacter, now: number): void {
    if (!owner.activateSimpleDomain(now)) return
    this.cooldowns.start(this.cooldownId(owner, 'simpleDomain'), now, 6500)
    this.combat.simpleDomainEffect(owner)
  }

  private activateDomain(owner: BaseCharacter, opponent: BaseCharacter, now: number): void {
    if (this.domainOwner && !this.domainOwner.domainActive(now)) this.domainOwner = undefined
    if (this.domainOwner && this.domainOwner !== owner) {
      if (!owner.activateDomain(now)) return
      this.startDomainClash(this.domainOwner, owner, now)
      return
    }
    if (this.domainOwner) return
    if (!owner.activateDomain(now)) return
    this.domainOwner = owner; this.nextDomainStrikeAt = now + (owner.definition.id === 'sukuna' ? 240 : 450); opponent.hitstunUntil = Math.max(opponent.hitstunUntil, now + 550); opponent.velocityX = 0
    if (owner.definition.id === 'gojo') { opponent.immobilizedUntil = now + 5000; opponent.hitstunUntil = Math.max(opponent.hitstunUntil, opponent.immobilizedUntil); opponent.velocityY = 0 }
    if (owner.definition.id === 'yuta') this.spawnYutaSwords(owner)
    const overlay = this.add.circle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS, owner.definition.color, 0.13).setDepth(30)
    const frame = this.add.graphics().setDepth(31); frame.lineStyle(3, owner.definition.color, 0.9); frame.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 12)
    const sukunaArt = owner.definition.id === 'sukuna' ? this.createSukunaDomainEffect() : undefined
    const label = this.add.text(ARENA_WIDTH / 2, 175, owner.definition.id === 'gojo' ? '무량공처 // 5초 정지' : owner.definition.id === 'sukuna' ? '복마어주자 // MALEVOLENT SHRINE' : owner.definition.name + ' // 영역전개', { color: owner.definition.accent, fontFamily: 'Space Mono, monospace', fontSize: '17px', fontStyle: 'bold', stroke: '#020711', strokeThickness: 6 }).setOrigin(0.5).setDepth(32)
    this.tweens.add({ targets: [overlay, frame, label, sukunaArt].filter(Boolean), alpha: 0, delay: 5800, duration: 700, onComplete: () => { overlay.destroy(); frame.destroy(); label.destroy(); sukunaArt?.destroy() } })
    this.cameras.main.flash(180, 170, 220, 255, false)
  }

  private startDomainClash(first: BaseCharacter, second: BaseCharacter, now: number): void {
    const clashDuration = 3600
    this.clearYutaSwords()
    this.domainOwner = undefined
    this.domainClashUntil = now + clashDuration
    this.domainClashParticipants = [first, second]
    this.domainClashRemaining = [Math.max(0, first.domainUntil - now), Math.max(0, second.domainUntil - now)]
    this.domainClashGauge.reset()
    first.domainUntil = Number.MAX_SAFE_INTEGER
    second.domainUntil = Number.MAX_SAFE_INTEGER
    first.immobilizedUntil = now
    second.immobilizedUntil = now
    first.hitstunUntil = now
    second.hitstunUntil = now
    this.domainClashGraphic = this.add.graphics().setDepth(31)
    this.domainClashGraphic.lineStyle(5, first.definition.color, 0.9); this.domainClashGraphic.strokeCircle(ARENA_CENTER_X - 90, ARENA_CENTER_Y, 165)
    this.domainClashGraphic.lineStyle(5, second.definition.color, 0.9); this.domainClashGraphic.strokeCircle(ARENA_CENTER_X + 90, ARENA_CENTER_Y, 165)
    this.domainClashGraphic.lineStyle(3, 0xffffff, 0.9); this.domainClashGraphic.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 42)
    this.domainClashLabel = this.add.text(ARENA_CENTER_X, ARENA_CENTER_Y - ARENA_RADIUS + 34, '영역 충돌 // DOMAIN CLASH', { color: '#fff3c1', fontFamily: 'Space Mono, monospace', fontSize: '18px', fontStyle: 'bold', stroke: '#080b18', strokeThickness: 6 }).setOrigin(0.5).setDepth(32)
    this.tweens.add({ targets: this.domainClashGraphic, angle: 360, duration: clashDuration, ease: 'Linear' })
    this.cameras.main.shake(260, 0.012)
  }

  private resolveDomainClash(now: number, forcedWinner?: DomainClashWinner): void {
    const participants = this.domainClashParticipants
    const remaining = this.domainClashRemaining ?? [0, 0]
    const resolvedWinner = forcedWinner ?? this.domainClashGauge.resolve()
    let winnerIndex: 0 | 1 | -1 = -1
    if (participants && resolvedWinner !== 'DRAW') winnerIndex = participants[0].slot === resolvedWinner ? 0 : participants[1].slot === resolvedWinner ? 1 : -1
    if (participants && winnerIndex !== -1) {
      const loserIndex: 0 | 1 = winnerIndex === 0 ? 1 : 0
      const winner = participants[winnerIndex]
      const loser = participants[loserIndex]
      winner.domainUntil = now + remaining[winnerIndex]
      loser.domainUntil = now
      loser.blockDomain(now)
      this.domainOwner = winner
      this.nextDomainStrikeAt = now + (winner.definition.id === 'sukuna' ? 240 : 450)
      if (winner.definition.id === 'yuta') this.spawnYutaSwords(winner)
      if (winner.definition.id === 'gojo') { loser.immobilizedUntil = now + 5000; loser.hitstunUntil = Math.max(loser.hitstunUntil, loser.immobilizedUntil); loser.velocityX = 0; loser.velocityY = 0 }
      this.roundMessage = `${winner.slot} 영역 승리 // ${loser.slot} 영역 완전 밀림`
    } else if (participants) {
      participants[0].domainUntil = now; participants[1].domainUntil = now; participants[0].blockDomain(now); participants[1].blockDomain(now); this.domainOwner = undefined; this.roundMessage = '영역 충돌 // 동시 상쇄'
    }
    this.clearYutaSwords()
    this.clearDomainClash()
    this.domainClashUntil = 0
    this.domainClashParticipants = undefined
    this.domainClashRemaining = undefined
    this.domainClashGauge.reset()
    this.time.delayedCall(900, () => { if (!this.roundFinished) this.roundMessage = '' })
  }

  private clearDomainClash(): void {
    this.domainClashGraphic?.destroy(); this.domainClashGraphic = undefined
    this.domainClashLabel?.destroy(); this.domainClashLabel = undefined
  }

  private createSukunaDomainEffect(): Phaser.GameObjects.Graphics {
    const art = this.add.graphics().setDepth(31)
    art.fillStyle(0x21040d, 0.62); art.fillCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 34)
    art.lineStyle(3, 0xf04464, 0.75); art.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 34)
    art.lineStyle(2, 0xff6b80, 0.55)
    for (let index = 0; index < 16; index += 1) { const angle = index * Math.PI / 8; art.lineBetween(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_CENTER_X + Math.cos(angle) * (ARENA_RADIUS - 34), ARENA_CENTER_Y + Math.sin(angle) * (ARENA_RADIUS - 34)) }
    art.lineStyle(7, 0x8d1837, 0.9); art.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 105)
    art.lineStyle(5, 0xff5772, 0.9); art.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 78)
    art.lineStyle(4, 0xff9aaa, 0.8); art.lineBetween(ARENA_CENTER_X - 145, ARENA_CENTER_Y, ARENA_CENTER_X + 145, ARENA_CENTER_Y); art.lineBetween(ARENA_CENTER_X, ARENA_CENTER_Y - 145, ARENA_CENTER_X, ARENA_CENTER_Y + 145)
    art.fillStyle(0xff3855, 0.7); art.fillCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 24); art.lineStyle(3, 0xffc2cc, 0.7); art.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 34)
    return art
  }

  private processCharacterSkills(owner: BaseCharacter, opponent: BaseCharacter, input: InputSnapshot, now: number): void {
    if (input.reversePressed) {
      const healed = owner.definition.id === 'yuta' ? this.yutaSkills.reverseTechnique(owner, now) : this.characterSkills.reverseTechnique(owner, now)
      void healed
    }
    const inputs = [input.skill1Pressed, input.skill2Pressed, input.skill3Pressed, input.skill4Pressed, input.skill5Pressed] as const
    inputs.forEach((pressed, index) => {
      const action = `skill${index + 1}` as const
      if (!pressed || !this.cooldowns.ready(this.cooldownId(owner, action), now)) return
      const cast = owner.definition.id === 'yuta' ? this.yutaSkills.cast(index as 0 | 1 | 2 | 3 | 4, owner, opponent, now) !== null : this.characterSkills.cast(index as 0 | 1 | 2 | 3 | 4, owner, opponent, now)
      if (cast) {
        const cooldown = owner.definition.id === 'yuta' ? this.yutaSkills.cooldown(index as 0 | 1 | 2 | 3 | 4) : this.characterSkills.cooldown(owner, index as 0 | 1 | 2 | 3 | 4)
        if (cooldown > 0) this.cooldowns.start(this.cooldownId(owner, action), now, cooldown)
      }
    })
  }

  private spawnYutaSwords(owner: BaseCharacter): void {
    this.clearYutaSwords()
    const positions = [owner.x - 170, owner.x - 72, owner.x + 42, owner.x + 152, owner.x + 250].map((x) => Phaser.Math.Clamp(x, ARENA_CENTER_X - ARENA_RADIUS + 55, ARENA_CENTER_X + ARENA_RADIUS - 55))
    this.yutaSwords = positions.map((x, index) => {
      const y = owner.y - 24 - (index % 2) * 6; const graphic = this.add.graphics().setDepth(8); graphic.lineStyle(4, 0xf4fbff, 0.95); graphic.beginPath(); graphic.moveTo(x, y - 36); graphic.lineTo(x + 11, y + 31); graphic.strokePath(); graphic.lineStyle(2, owner.definition.color, 0.9); graphic.beginPath(); graphic.moveTo(x - 11, y - 3); graphic.lineTo(x + 13, y - 3); graphic.strokePath(); graphic.fillStyle(0xd7c5ff, 0.9); graphic.fillCircle(x, y - 37, 4); return { graphic, x, y, triggered: false }
    })
  }

  private checkYutaSwordProximity(owner: BaseCharacter, opponent: BaseCharacter, now: number): void {
    if (!owner.fullManifestActive(now)) return
    this.yutaSwords.forEach((sword) => {
      if (!sword.triggered && Phaser.Math.Distance.Between(opponent.x, opponent.y - 60, sword.x, sword.y) < 48) { sword.triggered = true; sword.graphic.setAlpha(0.2); this.yutaSkills.useRandomCopy(owner, opponent, now) }
    })
  }

  private clearYutaSwords(): void { this.yutaSwords.forEach((sword) => sword.graphic.destroy()); this.yutaSwords = [] }

  private updateRikaSummons(now: number): void {
    ;[this.p1, this.p2].forEach((owner) => {
      const key = owner.slot; const opponent = owner === this.p1 ? this.p2 : this.p1; const current = this.rikaSummons[key]
      if (owner.definition.id !== 'yuta' || !owner.fullManifestActive(now) || owner.hp <= 0) { current?.destroy(); delete this.rikaSummons[key]; return }
      const summon = current ?? new RikaSummon(this, owner.x + owner.facing * 86, owner.y - 4); this.rikaSummons[key] = summon; summon.follow(owner.x, owner.y, owner.facing, now, ARENA_WIDTH)
      if (opponent.hp > 0 && now >= this.nextRikaAttackAt[key] && Phaser.Math.Distance.Between(summon.x, summon.y, opponent.x, opponent.y) < 170) { summon.triggerAttack(now); this.combat.companionStrike(owner, opponent, summon.x, summon.y, 18, now); this.nextRikaAttackAt[key] = now + 850 }
    })
  }

  private clearRikaSummons(): void { Object.values(this.rikaSummons).forEach((summon) => summon?.destroy()); delete this.rikaSummons.P1; delete this.rikaSummons.P2; this.nextRikaAttackAt.P1 = 0; this.nextRikaAttackAt.P2 = 0 }

  private updateMahoragaSupport(now: number): void {
    ;[this.p1, this.p2].forEach((owner) => {
      const key = owner.slot; const opponent = owner === this.p1 ? this.p2 : this.p1
      if (owner.definition.id !== 'sukuna' || !owner.mahoragaSummoned || owner.hp <= 0) { this.nextMahoragaAttackAt[key] = 0; return }
      if (opponent.hp > 0 && now >= this.nextMahoragaAttackAt[key] && Phaser.Math.Distance.Between(owner.x, owner.y, opponent.x, opponent.y) < 260) {
        const direction = opponent.x >= owner.x ? 1 : -1
        this.combat.companionStrike(owner, opponent, owner.x + direction * 70, owner.y, 22, now, '마허라 // 스쿠나 참격')
        this.nextMahoragaAttackAt[key] = now + 900
      }
    })
  }

  private cooldownId(owner: BaseCharacter, action: string): string { return `${owner.slot}:${action}` }

  private emptyInput(): InputSnapshot { return { left: false, right: false, up: false, down: false, jumpPressed: false, guard: false, attackPressed: false, reversePressed: false, strongPressed: false, simpleDomainPressed: false, skill1Pressed: false, skill2Pressed: false, skill3Pressed: false, skill4Pressed: false, skill5Pressed: false, ultimatePressed: false, dashLeft: false, dashRight: false, aimX: null } }

  private finishRound(winner: 'P1' | 'P2' | 'DRAW', now: number): void {
    if (this.roundFinished) return
    this.roundFinished = true; const result = this.rounds.record(winner, this.mode === 'solo' ? 2 : 3); this.roundEndAt = now + 1700; this.roundMessage = winner === 'DRAW' ? 'DRAW ROUND' : `${winner} TAKES THE ROUND`
    if (result.matchOver) { this.matchOver = true; this.matchEndAt = now + 1700; const matchWinner = this.getMatchWinner(); this.matchMessage = `${matchWinner} WINS THE MATCH` }
  }

  private getMatchWinner(): 'P1' | 'P2' {
    if (this.rounds.p1Rounds !== this.rounds.p2Rounds) return this.rounds.p1Rounds > this.rounds.p2Rounds ? 'P1' : 'P2'
    return this.p1.hp >= this.p2.hp ? 'P1' : 'P2'
  }

  private getRoundWinner(): 'P1' | 'P2' | 'DRAW' {
    if (this.p1.hp <= 0 && this.p2.hp <= 0) return 'DRAW'; if (this.p2.hp <= 0) return 'P1'; if (this.p1.hp <= 0) return 'P2'; if (this.p1.hp === this.p2.hp) return 'DRAW'; return this.p1.hp > this.p2.hp ? 'P1' : 'P2'
  }

  private resolveFighterCollision(): void {
    const offsetX = this.p2.x - this.p1.x
    const offsetY = this.p2.y - this.p1.y
    const distance = Math.hypot(offsetX, offsetY)
    if (distance >= 70) return
    const safeDistance = distance || 1
    const push = (70 - safeDistance) / 2
    const normalX = offsetX / safeDistance
    const normalY = offsetY / safeDistance
    this.p1.x -= normalX * push; this.p1.y -= normalY * push
    this.p2.x += normalX * push; this.p2.y += normalY * push
  }

  private emitHud(time: number): void {
    if (!this.p1 || !this.p2) return
    const domainClash = this.domainClashUntil > time ? this.domainClashHud() : null
    const state: BattleHudState = { p1: this.fighterHud(this.p1), p2: this.fighterHud(this.p2), timeLeft: Math.max(0, 90 - (time - this.roundStartedAt) / 1000), round: this.rounds.round, p1Rounds: this.rounds.p1Rounds, p2Rounds: this.rounds.p2Rounds, roundMessage: this.roundMessage, matchMessage: this.matchMessage, domainClash }
    this.events.emit('hud-update', state)
  }

  private domainClashHud(): NonNullable<BattleHudState['domainClash']> {
    const snapshot = this.domainClashGauge.snapshot()
    const leader = snapshot.p1 === snapshot.p2 ? 'DRAW' : snapshot.p1 > snapshot.p2 ? 'P1' : 'P2'
    return { ...snapshot, leader }
  }

  private fighterHud(fighter: BaseCharacter): BattleHudState['p1'] {
    const now = this.time.now
    return { name: fighter.definition.name, hp: fighter.hp, maxHp: fighter.definition.stats.maxHp, energy: fighter.energy, maxEnergy: fighter.definition.stats.maxEnergy, ultimate: fighter.ultimate, ultimateReady: fighter.ultimate >= 100, domainActive: fighter.domainActive(now), simpleDomainActive: fighter.simpleDomainActive(now), fullManifestActive: fighter.fullManifestActive(now), mahoragaSummoned: fighter.mahoragaSummoned, guard: fighter.isGuarding, combo: fighter.combo.index, cooldowns: { reverse: this.cooldowns.remaining(this.cooldownId(fighter, 'reverse'), now), skill1: this.cooldowns.remaining(this.cooldownId(fighter, 'skill1'), now), skill2: this.cooldowns.remaining(this.cooldownId(fighter, 'skill2'), now), skill3: this.cooldowns.remaining(this.cooldownId(fighter, 'skill3'), now), skill4: this.cooldowns.remaining(this.cooldownId(fighter, 'skill4'), now), skill5: this.cooldowns.remaining(this.cooldownId(fighter, 'skill5'), now), simpleDomain: this.cooldowns.remaining(this.cooldownId(fighter, 'simpleDomain'), now), domain: Math.max(this.cooldowns.remaining(this.cooldownId(fighter, 'domain'), now), fighter.domainBlockRemaining(now)) } }
  }

  private drawArena(): void {
    const background = this.add.graphics(); background.fillStyle(0x050a13, 1); background.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT)
    background.fillStyle(0x0b2031, 0.98); background.fillCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS)
    background.lineStyle(2, 0x15354d, 0.65)
    for (let radius = 72; radius < ARENA_RADIUS; radius += 72) background.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, radius)
    for (let index = 0; index < 16; index += 1) { const angle = index * Math.PI / 8; background.lineBetween(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_CENTER_X + Math.cos(angle) * ARENA_RADIUS, ARENA_CENTER_Y + Math.sin(angle) * ARENA_RADIUS) }
    background.lineStyle(5, 0x54c4d8, 0.82); background.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS)
    background.lineStyle(1, 0x8ceeff, 0.42); background.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 12)
    background.lineStyle(2, 0x1e536c, 0.75); background.strokeCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 64)
    background.fillStyle(0x62d8e8, 0.12); background.fillCircle(ARENA_CENTER_X, ARENA_CENTER_Y, 44)
    this.add.text(40, 38, 'BINDING VOW // CIRCULAR DUEL FIELD', { color: '#44748a', fontFamily: 'Space Mono, monospace', fontSize: '11px' })
    this.add.text(ARENA_CENTER_X, ARENA_CENTER_Y, '◈', { color: '#5bb9ce', fontSize: '16px' }).setOrigin(0.5)
  }
}
