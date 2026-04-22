import { useMemo } from 'react'
import { CHECKLIST_CATEGORIES } from '../data/checklist'
import { TIMELINE_PHASES } from '../data/timeline'

type Props = {
  checkedItems: Record<string, boolean>
  moveDate: string
  onSetMoveDate: (d: string) => void
  onNav: (tab: string) => void
}

export default function Dashboard({ checkedItems, moveDate, onSetMoveDate, onNav }: Props) {
  const totalItems = useMemo(
    () => CHECKLIST_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0),
    []
  )
  const doneItems = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  )
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  const daysLeft = useMemo(() => {
    if (!moveDate) return null
    const diff = new Date(moveDate).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }, [moveDate])

  const currentPhase = useMemo(() => {
    if (!moveDate) return null
    const months = daysLeft != null ? Math.ceil(daysLeft / 30) : 0
    if (months >= 18) return TIMELINE_PHASES[0]
    if (months >= 12) return TIMELINE_PHASES[1]
    if (months >= 6) return TIMELINE_PHASES[2]
    if (months >= 1) return TIMELINE_PHASES[3]
    if (months >= -3) return TIMELINE_PHASES[4]
    return TIMELINE_PHASES[5]
  }, [moveDate, daysLeft])

  const recentCategories = CHECKLIST_CATEGORIES.slice(0, 3)

  return (
    <div className="dashboard">
      <div className="hero-card">
        <div className="hero-inner">
          <div className="hero-brand">
            <span className="hero-flag">🇮🇳</span>
            <div>
              <h1 className="hero-title">R2I Planner</h1>
              <p className="hero-subtitle">Return to India, planned step by step</p>
            </div>
          </div>

          {daysLeft != null ? (
            <div className="hero-countdown">
              {daysLeft > 0 ? (
                <>
                  <span className="countdown-num">{daysLeft}</span>
                  <span className="countdown-label">days until home</span>
                </>
              ) : daysLeft === 0 ? (
                <span className="countdown-label">Today's the day! 🎉</span>
              ) : (
                <span className="countdown-label">You arrived {Math.abs(daysLeft)} days ago 🏡</span>
              )}
              {currentPhase && (
                <div className="phase-badge" style={{ borderColor: currentPhase.color, color: currentPhase.color }}>
                  {currentPhase.label}
                </div>
              )}
            </div>
          ) : (
            <p className="hero-no-date">Set a move date below to start your countdown</p>
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-title-row">
          <h2 className="section-title">Move Date</h2>
        </div>
        <input
          type="date"
          className="date-input"
          value={moveDate}
          onChange={e => onSetMoveDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="section-card">
        <h2 className="section-title">Overall Progress</h2>
        <div className="progress-header">
          <span>{doneItems} of {totalItems} tasks done</span>
          <span className="progress-pct">{pct}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && <p className="progress-done">All tasks complete — welcome home! 🎊</p>}
      </div>

      <div className="section-card">
        <div className="section-title-row">
          <h2 className="section-title">Quick Checklist</h2>
          <button className="link-btn" onClick={() => onNav('checklist')}>View all →</button>
        </div>
        {recentCategories.map(cat => {
          const done = cat.items.filter(i => checkedItems[i.id]).length
          const pctCat = Math.round((done / cat.items.length) * 100)
          return (
            <div key={cat.id} className="mini-category" onClick={() => onNav('checklist')}>
              <span className="mini-cat-icon">{cat.icon}</span>
              <div className="mini-cat-info">
                <div className="mini-cat-title">{cat.title}</div>
                <div className="mini-progress-bar-bg">
                  <div className="mini-progress-bar-fill" style={{ width: `${pctCat}%`, background: cat.color }} />
                </div>
              </div>
              <span className="mini-cat-count" style={{ color: cat.color }}>{done}/{cat.items.length}</span>
            </div>
          )
        })}
        <button className="cta-btn" onClick={() => onNav('checklist')}>Open Full Checklist</button>
      </div>

      <div className="quick-nav-grid">
        <button className="quick-nav-card" onClick={() => onNav('finance')}>
          <span className="quick-nav-icon">💰</span>
          <span>Finance</span>
        </button>
        <button className="quick-nav-card" onClick={() => onNav('explore')}>
          <span className="quick-nav-icon">🗺️</span>
          <span>Cities</span>
        </button>
        <button className="quick-nav-card" onClick={() => onNav('checklist')}>
          <span className="quick-nav-icon">✅</span>
          <span>Checklist</span>
        </button>
        <button className="quick-nav-card" onClick={() => onNav('more')}>
          <span className="quick-nav-icon">📊</span>
          <span>Projection</span>
        </button>
      </div>
    </div>
  )
}
