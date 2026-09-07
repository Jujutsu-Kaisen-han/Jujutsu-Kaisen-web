import type { ReactElement } from 'react'
import type { BattleHudState, FighterHudState } from '../game/types/CombatTypes'

interface BattleHUDProps { state: BattleHudState | null }

const emptyCooldowns = { reverse: 0, skill1: 0, skill2: 0, skill3: 0, skill4: 0, skill5: 0, simpleDomain: 0, domain: 0 }
const cooldownText = (milliseconds: number): string => milliseconds > 0 ? `${(milliseconds / 1000).toFixed(1)}s` : 'READY'

function FighterPanel({ fighter, side }: { fighter: FighterHudState; side: 'p1' | 'p2' }): ReactElement {
  return <div className={`fighter-panel ${side}`}><div className="fighter-name"><span className="fighter-slot">{side.toUpperCase()}</span><b>{fighter.name}</b>{fighter.guard && <i>GUARD</i>}{fighter.simpleDomainActive && <i className="domain-active">간이영역</i>}{fighter.domainActive && <i className="domain-active">DOMAIN</i>}{fighter.fullManifestActive && <i className="domain-active">RIKA FULL</i>}</div><div className="battle-bar hp"><span style={{ width: `${(fighter.hp / fighter.maxHp) * 100}%` }} /></div><div className="battle-bar energy"><span style={{ width: `${(fighter.energy / fighter.maxEnergy) * 100}%` }} /></div><div className="meter-labels"><span>HP {Math.ceil(fighter.hp)}</span><span>주력 {Math.ceil(fighter.energy)}</span></div><div className={`ultimate-meter ${fighter.ultimateReady ? 'ready' : ''}`}><span style={{ width: `${fighter.ultimate}%` }} /></div><small>영역전개 {fighter.domainActive ? 'ACTIVE' : fighter.ultimateReady ? 'READY // H / L' : `${Math.floor(fighter.ultimate)}%`}</small></div>
}

export function BattleHUD({ state }: BattleHUDProps): ReactElement {
  const p1 = state?.p1 ?? { name: 'P1', hp: 112, maxHp: 112, energy: 100, maxEnergy: 100, ultimate: 0, ultimateReady: false, domainActive: false, simpleDomainActive: false, fullManifestActive: false, guard: false, combo: 0, cooldowns: emptyCooldowns }
  const p2 = state?.p2 ?? { name: 'P2', hp: 120, maxHp: 120, energy: 100, maxEnergy: 100, ultimate: 0, ultimateReady: false, domainActive: false, simpleDomainActive: false, fullManifestActive: false, guard: false, combo: 0, cooldowns: emptyCooldowns }
  return <div className="battle-hud"><div className="battle-top"><FighterPanel fighter={p1} side="p1" /><div className="round-clock"><span>ROUND {state?.round ?? 1}</span><strong>{Math.ceil(state?.timeLeft ?? 90).toString().padStart(2, '0')}</strong><small>{state?.p1Rounds ?? 0} — {state?.p2Rounds ?? 0}</small></div><FighterPanel fighter={p2} side="p2" /></div>{state?.roundMessage && <div className="round-banner">{state.roundMessage}</div>}<div className="battle-bottom"><span><b>P1 LMB</b> BASIC</span><span><b>P1 RMB</b> RCT {cooldownText(p1.cooldowns.reverse)}</span><span><b>P1 E R T Y U</b> SKILLS</span><span><b>P1 F</b> GUARD</span><span><b>P1 G</b> SIMPLE DOMAIN {cooldownText(p1.cooldowns.simpleDomain)}</span><span><b>P1 H</b> DOMAIN</span><span><b>P2 1</b> BASIC</span><span><b>P2 2</b> GUARD</span><span><b>P2 3</b> SIMPLE DOMAIN</span><span><b>P2 4 - 8</b> SKILLS</span><span><b>P2 L</b> DOMAIN</span><span><b>W / ↑</b> JUMP</span><span><b>A / D / ← →</b> MOVE</span><span className="phase-note">CD E:{cooldownText(p1.cooldowns.skill1)} R:{cooldownText(p1.cooldowns.skill2)} T:{cooldownText(p1.cooldowns.skill3)} Y:{cooldownText(p1.cooldowns.skill4)} U:{cooldownText(p1.cooldowns.skill5)}</span></div></div>
}
