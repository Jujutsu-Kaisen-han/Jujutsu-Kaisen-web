import { useState, type CSSProperties, type ReactElement } from 'react'
import { CHARACTER_DEFINITIONS, CHARACTER_ORDER, type CharacterId, type GameMode } from '../game/types/CharacterTypes'

interface CharacterSelectUIProps { onStart: (p1: CharacterId, p2: CharacterId, mode: GameMode) => void }

export function CharacterSelectUI({ onStart }: CharacterSelectUIProps): ReactElement {
  const [mode, setMode] = useState<GameMode>('local')
  const [p1, setP1] = useState<CharacterId>('yuta')
  const [p2, setP2] = useState<CharacterId>('yuji')
  const [p1Ready, setP1Ready] = useState(false)
  const [p2Ready, setP2Ready] = useState(false)
  const changeMode = (nextMode: GameMode): void => { setMode(nextMode); setP1Ready(false); setP2Ready(false) }
  const renderCard = (id: CharacterId, player: 'P1' | 'P2'): ReactElement => {
    const selected = (player === 'P1' ? p1 : p2) === id
    const definition = CHARACTER_DEFINITIONS[id]
    const cardClass = 'character-card ' + (selected ? 'selected ' + player.toLowerCase() : '')
    const color = '#' + definition.color.toString(16).padStart(6, '0')
    return <button type="button" key={player + '-' + id} className={cardClass} aria-pressed={selected} onClick={() => player === 'P1' ? setP1(id) : setP2(id)} style={{ '--fighter-color': definition.accent } as CSSProperties}><span className="portrait" style={{ background: color }}>{definition.name.slice(0, 1)}</span><span className="character-copy"><b>{definition.name}</b><small>{definition.title}</small></span>{selected && <span className="selected-mark">{player}</span>}</button>
  }
  const canStart = mode === 'local' ? p1Ready && p2Ready : p1Ready
  const panelClass = 'select-panels ' + (mode !== 'local' ? 'solo-select' : '')
  return <main className="select-shell">
    <header className="select-header"><div className="brand-lockup"><span className="brand-mark">◈</span><div><strong>CURSED BLADE</strong><small>DUEL PROTOCOL / CHARACTER SELECT</small></div></div><span className="select-version">BEST OF 3 // 90 SEC</span></header>
    <section className="select-hero"><span className="eyebrow">BINDING VOW // PHASE 01</span><h1>CHOOSE YOUR<br /><em>TECHNIQUE.</em></h1><p>{mode === 'solo' ? 'Defeat every opponent in the gauntlet. The AI will not hold back.' : mode === 'online' ? 'Find a remote opponent and fight in real time.' : 'Two operators. One field. Read your opponent and take two rounds.'}</p></section>
    <div className="mode-switch">
      <button type="button" className={mode === 'solo' ? 'active' : ''} onClick={() => changeMode('solo')}>SOLO GAUNTLET <small>5 OPPONENTS</small></button>
      <button type="button" className={mode === 'local' ? 'active' : ''} onClick={() => changeMode('local')}>LOCAL 1 VS 1 <small>TWO KEYBOARDS</small></button>
      <button type="button" className={mode === 'online' ? 'active' : ''} onClick={() => changeMode('online')}>ONLINE 1 VS 1 <small>WEBSOCKET MATCHMAKING</small></button>
    </div>
    <section className={panelClass}>
      <div className="select-player p1-panel"><div className="player-heading"><span className="player-chip">P1</span><div><b>PLAYER ONE</b><small>WASD / MOUSE / E R T Y U / F G H</small></div><span className={'ready-state ' + (p1Ready ? 'on' : '')}>{p1Ready ? 'READY' : 'SELECT'}</span></div><div className="character-grid">{CHARACTER_ORDER.map((id) => renderCard(id, 'P1'))}</div><button type="button" className={'ready-button ' + (p1Ready ? 'confirmed' : '')} onClick={() => setP1Ready((ready) => !ready)}>{p1Ready ? 'P1 READY // CHANGE' : 'P1 READY'}</button></div>
      {mode === 'solo' && <div className="solo-opponent-panel"><span className="ai-badge">AI // NIGHTMARE</span><strong>FIVE FIGHTERS</strong><p>Choose one operator.<br />The remaining roster will challenge you in sequence.</p><div className="queue-dots">{CHARACTER_ORDER.filter((id) => id !== p1).map((id) => <span key={id} title={CHARACTER_DEFINITIONS[id].name} style={{ background: '#' + CHARACTER_DEFINITIONS[id].color.toString(16).padStart(6, '0') }} />)}</div></div>}
      {mode === 'online' && <div className="solo-opponent-panel"><span className="ai-badge">ONLINE // MATCHMAKING</span><strong>FIND OPPONENT</strong><p>Choose your fighter.<br />The server will pair you with another player.</p><div className="queue-dots"><span style={{ background: '#73e6ff' }} /><span style={{ background: '#ff718f' }} /></div></div>}
      {mode === 'local' && <><div className="versus">VS<span>◈</span></div><div className="select-player p2-panel"><div className="player-heading"><span className="player-chip">P2</span><div><b>PLAYER TWO</b><small>ARROWS / 1 BASIC / 2 GUARD / 3 SD / 4-8 SKILLS / 9 RCT / 0 DOMAIN</small></div><span className={'ready-state ' + (p2Ready ? 'on' : '')}>{p2Ready ? 'READY' : 'SELECT'}</span></div><div className="character-grid">{CHARACTER_ORDER.map((id) => renderCard(id, 'P2'))}</div><button type="button" className={'ready-button ' + (p2Ready ? 'confirmed' : '')} onClick={() => setP2Ready((ready) => !ready)}>{p2Ready ? 'P2 READY // CHANGE' : 'P2 READY'}</button></div></>}
    </section>
    <button type="button" className="start-match" disabled={!canStart} onClick={() => onStart(p1, mode === 'local' ? p2 : 'yuji', mode)}>START DUEL <span>→</span></button>
    <footer className="select-footer">{mode === 'solo' ? 'NIGHTMARE AI // ADAPTIVE DEFENSE // ROSTER GAUNTLET' : mode === 'online' ? 'ONLINE // RANDOM OPPONENT MATCHMAKING' : 'SAME CHARACTER MATCHES ALLOWED'} <i /> CURSED ENERGY SYSTEM // INPUT READY</footer>
  </main>
}
