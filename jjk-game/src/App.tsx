import { useState } from 'react'
import { BattleHUD } from './components/BattleHUD'
import { CharacterSelectUI } from './components/CharacterSelectUI'
import { GameCanvas } from './components/GameCanvas'
import { CHARACTER_DEFINITIONS, CHARACTER_ORDER, type CharacterId, type GameMode } from './game/types/CharacterTypes'
import type { BattleHudState } from './game/types/CombatTypes'
import './App.css'

interface MatchResult { winner: 'P1' | 'P2'; p1Rounds: number; p2Rounds: number }
type Screen = 'select' | 'battle' | 'result'

function App() {
  const [screen, setScreen] = useState<Screen>('select'); const [selection, setSelection] = useState({ p1: 'yuta' as CharacterId, p2: 'yuji' as CharacterId, mode: 'local' as GameMode }); const [hud, setHud] = useState<BattleHudState | null>(null); const [result, setResult] = useState<MatchResult | null>(null); const [soloQueue, setSoloQueue] = useState<CharacterId[]>([]); const [soloIndex, setSoloIndex] = useState(0)
  const startGame = (p1: CharacterId, p2: CharacterId, mode: GameMode): void => { setSelection({ p1, p2, mode }); if (mode === 'solo') { setSoloQueue(CHARACTER_ORDER.filter((id) => id !== p1)); setSoloIndex(0) } setHud(null); setScreen('battle') }
  const advanceSolo = (): void => { const nextIndex = soloIndex + 1; if (nextIndex >= soloQueue.length) return; setSoloIndex(nextIndex); setSelection({ p1: selection.p1, p2: soloQueue[nextIndex], mode: 'solo' }); setResult(null); setHud(null); setScreen('battle') }
  const hasNextSolo = selection.mode === 'solo' && soloIndex < soloQueue.length - 1 && result?.winner === 'P1'
  if (screen === 'select') return <CharacterSelectUI onStart={startGame} />
  if (screen === 'result' && result) return <main className="result-shell"><span className="eyebrow">{hasNextSolo ? 'SOLO GAUNTLET // OPPONENT CLEARED' : 'MATCH COMPLETE // BEST OF 3'}</span><h1>{hasNextSolo ? 'NEXT CHALLENGER' : `${result.winner} VICTORY`}</h1><p>{hasNextSolo ? CHARACTER_DEFINITIONS[soloQueue[soloIndex + 1]].name : `${result.p1Rounds} — ${result.p2Rounds}`}</p>{hasNextSolo ? <button type="button" onClick={advanceSolo}>NEXT OPPONENT →</button> : <button type="button" onClick={() => { setResult(null); setHud(null); setScreen('select') }}>RETURN TO SELECT</button>}</main>
  return <main className="battle-shell"><header className="battle-header"><div className="brand-lockup"><span className="brand-mark">◈</span><div><strong>CURSED BLADE</strong><small>LOCAL DUEL PROTOCOL / BATTLE</small></div></div><span className="header-status"><span className="status-dot" /> TWO OPERATORS ONLINE</span></header><section className="battle-stage"><GameCanvas selection={selection} onHudUpdate={setHud} onMatchOver={(matchResult) => { setResult(matchResult); setScreen('result') }} /><BattleHUD state={hud} /></section></main>
}

export default App
