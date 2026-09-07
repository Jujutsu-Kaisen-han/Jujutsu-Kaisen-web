import { useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { HudOverlay } from './components/HudOverlay'
import type { HudState } from './game/types/gameTypes'
import './App.css'

function App() {
  const [hud, setHud] = useState<HudState | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [restartToken, setRestartToken] = useState(0)
  return <main className="app-shell">
    <header className="site-header"><div className="brand-lockup"><span className="brand-mark">◈</span><div><strong>CURSED BLADE</strong><small>FIELD SIMULATION / 01</small></div></div><div className="header-status"><span className="status-dot" /> SYSTEM ONLINE <span className="header-divider" /> BUILD 0.5.0</div></header>
    <section className="game-section"><GameCanvas onHudUpdate={setHud} onGameOver={() => setGameOver(true)} restartToken={restartToken} /><HudOverlay state={hud} /><div className="reticle-hint">MOUSE AIM <span>•</span> WASD MOVE</div>{gameOver && <div className="game-over-screen"><div className="game-over-panel"><span className="eyebrow">OPERATOR STATUS // CRITICAL</span><h1>CURSED OUT</h1><p>THE FIELD HAS FALLEN SILENT.</p><button type="button" onClick={() => { setGameOver(false); setHud(null); setRestartToken((token) => token + 1) }}>REDEPLOY</button></div></div>}</section>
    <footer className="control-footer"><span><b>WASD</b> MOVE</span><span><b>LMB</b> SWORD COMBO</span><span><b>SPACE</b> DASH</span><span><b>Q / E / R</b> TECHNIQUES</span><span><b>F</b> ULTIMATE</span><span className="footer-note">NO CURSE. NO MERCY.</span></footer>
  </main>
}

export default App
