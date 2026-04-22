import { useState } from 'react'
import { DEFAULT_EXCHANGE_RATE, NRI_COUNTRIES } from '../data/finance'
import type { NRICountry } from '../data/finance'
import Notes from './Notes'
import Resources from './Resources'
import RNOR from './RNOR'
import Timeline from './Timeline'

type SubPage = null | 'notes' | 'resources' | 'rnor' | 'timeline'

type Props = {
  rate: number
  onRateChange: (r: number) => void
  moveDate: string
  onMoveDateChange: (d: string) => void
  country: NRICountry
  onCountryChange: (c: NRICountry) => void
  notes: string
  onNotesUpdate: (s: string) => void
  onResetAll: () => void
}

export default function Settings({ rate, onRateChange, moveDate, onMoveDateChange, country, onCountryChange, notes, onNotesUpdate, onResetAll }: Props) {
  const [subPage, setSubPage] = useState<SubPage>(null)
  const [rateInput, setRateInput] = useState(String(rate || DEFAULT_EXCHANGE_RATE))
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (subPage === 'notes') return <SubPageWrap title="Notes" onBack={() => setSubPage(null)}><Notes notes={notes} onUpdate={onNotesUpdate} /></SubPageWrap>
  if (subPage === 'resources') return <SubPageWrap title="Resources" onBack={() => setSubPage(null)}><Resources /></SubPageWrap>
  if (subPage === 'rnor') return <SubPageWrap title="RNOR Planner" onBack={() => setSubPage(null)}><RNOR moveDate={moveDate} onMoveDateChange={onMoveDateChange} /></SubPageWrap>
  if (subPage === 'timeline') return <SubPageWrap title="Timeline" onBack={() => setSubPage(null)}><Timeline moveDate={moveDate} /></SubPageWrap>

  function applyRate() {
    const parsed = parseFloat(rateInput)
    if (!isNaN(parsed) && parsed > 0) onRateChange(parsed)
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Preferences, tools & planning</p>
      </div>

      {/* Country */}
      <div className="settings-section">
        <h2 className="settings-section-title">🌍 Your Country</h2>
        <p className="settings-section-desc">Used to show relevant retirement account types in Finance.</p>
        <div className="country-grid">
          {NRI_COUNTRIES.map(c => (
            <button
              key={c.id}
              className={`country-btn ${country === c.id ? 'active' : ''}`}
              onClick={() => onCountryChange(c.id)}
            >
              <span className="country-flag">{c.flag}</span>
              <span className="country-label">{c.label}</span>
              <span className="country-currency">{c.currency}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rate */}
      <div className="settings-section">
        <h2 className="settings-section-title">💱 Exchange Rate</h2>
        <p className="settings-section-desc">Used for all USD ↔ INR conversions across the app.</p>
        <div className="settings-rate-row">
          <span className="settings-rate-label">1 USD =</span>
          <input
            className="settings-rate-input"
            type="number"
            value={rateInput}
            min="1" step="0.5"
            onChange={e => setRateInput(e.target.value)}
            onBlur={applyRate}
            onKeyDown={e => e.key === 'Enter' && applyRate()}
          />
          <span className="settings-rate-label">INR</span>
        </div>
        <div className="settings-rate-presets">
          {[80, 83, 84, 85, 86, 88].map(r => (
            <button key={r} className={`rate-preset-btn ${parseFloat(rateInput) === r ? 'active' : ''}`} onClick={() => { setRateInput(String(r)); onRateChange(r) }}>₹{r}</button>
          ))}
        </div>
        <p className="settings-rate-hint">Current: <strong>1 USD = ₹{rate || DEFAULT_EXCHANGE_RATE}</strong></p>
      </div>

      {/* Move Date */}
      <div className="settings-section">
        <h2 className="settings-section-title">📅 Move Date</h2>
        <p className="settings-section-desc">Your planned date of return to India.</p>
        <input type="date" className="date-input" value={moveDate} onChange={e => onMoveDateChange(e.target.value)} />
        {moveDate && (
          <p className="settings-rate-hint">
            <strong>{new Date(moveDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </p>
        )}
      </div>

      {/* Tools */}
      <div className="settings-section">
        <h2 className="settings-section-title">🛠️ Tools & Planning</h2>
        {[
          { key: 'rnor', icon: '📊', title: 'RNOR Tax Planner', sub: 'Calculate your RNOR window & optimize tax events' },
          { key: 'timeline', icon: '🗓️', title: 'Timeline', sub: 'Phase-by-phase R2I journey guide' },
          { key: 'resources', icon: '🔗', title: 'Resources', sub: 'Curated links for your R2I journey' },
          { key: 'notes', icon: '📝', title: 'Notes', sub: notes.length > 0 ? `${notes.length} characters saved` : 'Personal scratch pad' },
        ].map(item => (
          <button key={item.key} className="settings-nav-row" onClick={() => setSubPage(item.key as SubPage)}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div className="settings-nav-info">
              <span className="settings-nav-title">{item.title}</span>
              <span className="settings-nav-sub">{item.sub}</span>
            </div>
            <span className="settings-nav-arrow">›</span>
          </button>
        ))}
      </div>

      {/* About */}
      <div className="settings-section">
        <div className="settings-about-card">
          <div className="settings-about-flag">🇮🇳</div>
          <div className="settings-about-name">R2I Planner</div>
          <div className="settings-about-sub">Return to India, planned step by step</div>
          <div className="settings-about-version">v2.0.0 · All data stored locally</div>
        </div>
      </div>

      {/* Reset */}
      <div className="settings-section settings-section--danger">
        <h2 className="settings-section-title">⚠️ Data</h2>
        {!showResetConfirm ? (
          <button className="settings-danger-btn" onClick={() => setShowResetConfirm(true)}>Reset All App Data</button>
        ) : (
          <div className="settings-confirm-block">
            <p className="settings-confirm-msg">This will permanently erase all checklists, financial data, notes, and settings.</p>
            <div className="settings-confirm-actions">
              <button className="settings-confirm-cancel" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="settings-confirm-ok" onClick={() => { onResetAll(); setShowResetConfirm(false) }}>Yes, Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SubPageWrap({ title: _title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Back to Settings</button>
      {children}
    </div>
  )
}
