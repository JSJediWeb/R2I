import { TIMELINE_PHASES } from '../data/timeline'

type Props = {
  moveDate: string
}

export default function Timeline({ moveDate }: Props) {
  const daysLeft = moveDate
    ? Math.ceil((new Date(moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null
  const monthsLeft = daysLeft != null ? Math.ceil(daysLeft / 30) : null

  const activePhaseId = (() => {
    if (monthsLeft == null) return null
    if (monthsLeft >= 18) return 'phase-1'
    if (monthsLeft >= 12) return 'phase-2'
    if (monthsLeft >= 6) return 'phase-3'
    if (monthsLeft >= 1) return 'phase-4'
    if (monthsLeft >= -3) return 'phase-5'
    return 'phase-6'
  })()

  return (
    <div className="timeline-page">
      <div className="page-header">
        <h1 className="page-title">Timeline</h1>
        <p className="page-subtitle">Your R2I journey, phase by phase</p>
      </div>

      {!moveDate && (
        <div className="info-banner">
          Set your move date on the Dashboard to highlight your current phase
        </div>
      )}

      <div className="timeline-list">
        {TIMELINE_PHASES.map((phase, idx) => {
          const isActive = phase.id === activePhaseId
          return (
            <div key={phase.id} className={`phase-block ${isActive ? 'phase-active' : ''}`}>
              <div className="phase-connector">
                <div className="phase-dot" style={{ background: phase.color }}>
                  {isActive && <div className="phase-dot-pulse" style={{ borderColor: phase.color }} />}
                </div>
                {idx < TIMELINE_PHASES.length - 1 && <div className="phase-line" />}
              </div>
              <div className="phase-content">
                <div className="phase-header">
                  <div>
                    <h3 className="phase-title" style={{ color: phase.color }}>{phase.label}</h3>
                    <span className="phase-timeframe">{phase.timeframe}</span>
                  </div>
                  {isActive && <span className="phase-current-badge" style={{ background: phase.color }}>You are here</span>}
                </div>
                <ul className="phase-tasks">
                  {phase.tasks.map(task => (
                    <li key={task.id} className="phase-task">
                      <span className="phase-task-dot" style={{ background: phase.color }} />
                      <div>
                        <span className="phase-task-text">{task.text}</span>
                        <span className="phase-task-tag">{task.category}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
