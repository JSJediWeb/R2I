import { useState, useMemo } from 'react'
import { CHECKLIST_CATEGORIES } from '../data/checklist'

type Props = {
  checkedItems: Record<string, boolean>
  onToggle: (id: string) => void
}

export default function Checklist({ checkedItems, onToggle }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(CHECKLIST_CATEGORIES[0].id)
  const [filter, setFilter] = useState<'all' | 'done' | 'todo'>('all')

  const totalDone = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  )
  const total = useMemo(
    () => CHECKLIST_CATEGORIES.reduce((s, c) => s + c.items.length, 0),
    []
  )

  return (
    <div className="checklist-page">
      <div className="page-header">
        <h1 className="page-title">Checklist</h1>
        <p className="page-subtitle">{totalDone} / {total} tasks complete</p>
      </div>

      <div className="filter-tabs">
        {(['all', 'todo', 'done'] as const).map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : 'Done'}
          </button>
        ))}
      </div>

      <div className="categories-list">
        {CHECKLIST_CATEGORIES.map(cat => {
          const items = cat.items.filter(item => {
            const isDone = !!checkedItems[item.id]
            if (filter === 'done') return isDone
            if (filter === 'todo') return !isDone
            return true
          })
          if (items.length === 0) return null
          const doneCat = cat.items.filter(i => checkedItems[i.id]).length
          const isOpen = openCategory === cat.id

          return (
            <div key={cat.id} className="category-block">
              <button
                className="category-header"
                style={{ borderLeftColor: cat.color }}
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-header-info">
                  <span className="cat-title">{cat.title}</span>
                  <span className="cat-progress-text" style={{ color: cat.color }}>
                    {doneCat}/{cat.items.length}
                  </span>
                </div>
                <span className="cat-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <ul className="items-list">
                  {items.map(item => (
                    <li
                      key={item.id}
                      className={`checklist-item ${checkedItems[item.id] ? 'done' : ''}`}
                      onClick={() => onToggle(item.id)}
                    >
                      <span
                        className="check-circle"
                        style={checkedItems[item.id] ? { background: cat.color, borderColor: cat.color } : { borderColor: cat.color }}
                      >
                        {checkedItems[item.id] && <span className="check-tick">✓</span>}
                      </span>
                      <span className="item-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
