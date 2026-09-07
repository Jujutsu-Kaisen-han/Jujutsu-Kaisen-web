import type { ReactElement } from 'react'
import type { HudState, SkillKey } from '../game/types/gameTypes'

interface HudOverlayProps { state: HudState | null }
const skills: Array<{ key: SkillKey; name: string; cooldown: number }> = [{ key: 'Q', name: 'CURSED SLASH', cooldown: 2600 }, { key: 'E', name: 'FLASH STEP', cooldown: 4200 }, { key: 'R', name: 'RING OF LIGHT', cooldown: 7200 }, { key: 'F', name: 'RIKA // MANIFEST', cooldown: 16000 }]

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: 'hp' | 'energy' }): ReactElement {
  return <div className="resource-row"><div className="resource-label"><span>{label}</span><span>{Math.ceil(value)} / {max}</span></div><div className={`resource-bar ${tone}`}><span style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }} /></div></div>
}

export function HudOverlay({ state }: HudOverlayProps): ReactElement {
  return <div className="hud-overlay">
    <div className="hud-top-left"><div className="operator-tag"><span className="status-dot" /> ACTIVE OPERATOR <span className="mono">YUTA-01</span></div><Bar label="HP" value={state?.hp ?? 160} max={state?.maxHp ?? 160} tone="hp" /><Bar label="CURSED ENERGY" value={state?.energy ?? 100} max={state?.maxEnergy ?? 100} tone="energy" /></div>
    <div className="hud-top-right"><span className="eyebrow">EXORCISMS</span><strong>{String(state?.kills ?? 0).padStart(2, '0')}</strong><span className="wave-counter">WAVE {String(state?.wave ?? 1).padStart(2, '0')} <i /> {state?.enemiesRemaining ?? 0} HOSTILES</span></div>
    {state && state.ultimateRemaining > 0 && <div className="ultimate-timer"><span>RIKA MANIFESTED</span><strong>{(state.ultimateRemaining / 1000).toFixed(1)}s</strong></div>}
    <div className="skill-bar"><span className="skill-bar-label">TECHNIQUES</span>{skills.map((skill) => { const remaining = state?.cooldowns[skill.key] ?? 0; const ready = state?.ready[skill.key] ?? false; return <div className={`skill-card ${ready ? 'ready' : ''}`} key={skill.key}><div className="skill-key">{skill.key}</div><div className="skill-copy"><b>{skill.name}</b><span>{remaining > 0 ? `${(remaining / 1000).toFixed(1)}s` : ready ? 'READY' : 'LOW ENERGY'}</span></div>{remaining > 0 && <div className="cooldown-mask" style={{ height: `${Math.min(100, (remaining / skill.cooldown) * 100)}%` }} />}</div> })}</div>
  </div>
}
