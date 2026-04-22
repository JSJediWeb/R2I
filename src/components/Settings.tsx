import { useState } from 'react'
import { DEFAULT_EXCHANGE_RATE } from '../data/finance'
import Notes from './Notes'
import Resources from './Resources'

type SubPage = null | 'notes' | 'resources'

type Props = {
  rate: number
  onRateChange: (r: number) => void
  moveDate: string
  onMoveDateChange: (d: string) => void
  notes: string
  onNotesUpdate: (s: string) => void
  onResetAll: () => void
}

export default function Settings({ rate, onRateChange, moveDate, onMoveDateChange, notes, onNotesUpdate, onResetAll }: Props) {
  const [subPage, setSubPage] = useState<SubPage>(null)
  const [rateInput, setRateInput] = useState(String(rate || DEFAULT_EXCHANGE_RATE))
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (subPage === 'notes') {
    return (
      <div>
        <button className="back-btn" onClick={() => setSubPage(null)}>← Back to Settings</button>
        <Notes notes={notes} onUpdate={onNotesUpdate} />
      </div>
    )
  }

  if (subPage === 'resources') {
    return (
      <div>
        <button className="back-btn" onClick={() => setSubPage(null)}>← Back to Settings</button>
        <Resources />
      </div>
    )
  }

  function applyRate() {
    const parsed = parseFloat(rateInput)
    if (!isNaN(parsed) && parsed > 0) onRateChange(parsed)
  }

  function handleRateKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') applyRate()
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Preferences & tools</p>
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
            min="1"
            step="0.5"
            onChange={e => setRateInput(e.target.value)}
            onBlur={applyRate}
            onKeyDown={handleRateKey}
          />
          <span className="settings-rate-label">INR</span>
        </div>
        <div className="settings-rate-presets">
          {[80, 83, 84, 85, 86, 88].map(r => (
            <button
              key={r}
              className={`rate-preset-btn ${parseFloat(rateInput) === r ? 'active' : ''}`}
              onClick={() => { setRateInput(String(r)); onRateChange(r) }}
            >₹{r}</button>
          ))}
        </div>
        <p className="settings-rate-hint">Current: <strong>1 USD = ₹{rate || DEFAULT_EXCHANGE_RATE}</strong></p>
      </div>

      {/* Move Date */}
      <div className="settings-section">
        <h2 className="settings-section-title">📅 Move Date</h2>
        <p className="settings-section-desc">Your planned date of return to India.</p>
        <input
          type="date"
          className="date-input"
          value={moveDate}
          onChange={e => onMoveDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        {moveDate && (
          <p className="settings-rate-hint">
            Set to <strong>{new Date(moveDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </p>
        )}
      </div>

      {/* Resources & Notes */}
      <div className="settings-section">
        <h2 className="settings-section-title">📚 Content</h2>
        <button className="settings-nav-row" onClick={() => setSubPage('resources')}>
          <span>🔗</span>
          <div className="settings-nav-info">
            <span className="settings-nav-title">Resources</span>
            <span className="settings-nav-sub">Curated links for your R2I journey</span>
          </div>
          <span className="settings-nav-arrow">›</span>
        </button>
        <button className="settings-nav-row" onClick={() => setSubPage('notes')}>
          <span>📝</span>
          <div className="settings-nav-info">
            <span className="settings-nav-title">Notes</span>
            <span className="settings-nav-sub">{notes.length > 0 ? `${notes.length} characters saved` : 'Empty'}</span>
          </div>
          <span className="settings-nav-arrow">›</span>
        </button>
      </div>

      {/* About */}
      <div className="settings-section">
        <h2 className="settings-section-title">ℹ️ About</h2>
        <div className="settings-about-card">
          <div className="settings-about-flag">🇮🇳</div>
          <div className="settings-about-name">R2I Planner</div>
          <div className="settings-about-sub">Return to India, made easier</div>
          <div className="settings-about-version">v1.0.0 · All data stored locally on device</div>
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section settings-section--danger">
        <h2 className="settings-section-title">⚠️ Data</h2>
        {!showResetConfirm ? (
          <button className="settings-danger-btn" onClick={() => setShowResetConfirm(true)}>
            Reset All App Data
          </button>
        ) : (
          <div className="settings-confirm-block">
            <p className="settings-confirm-msg">This will permanently erase all your checklists, financial data, notes, and settings. Are you sure?</p>
            <div className="settings-confirm-actions">
              <button className="settings-confirm-cancel" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="settings-confirm-ok" onClick={() => { onResetAll(); setShowResetConfirm(false) }}>Yes, Reset Everything</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
