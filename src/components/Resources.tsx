import { useState } from 'react'
import { RESOURCE_CATEGORIES } from '../data/resources'

export default function Resources() {
  const [search, setSearch] = useState('')

  const filtered = RESOURCE_CATEGORIES.map(cat => ({
    ...cat,
    resources: cat.resources.filter(r =>
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tag.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.resources.length > 0)

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1 className="page-title">Resources</h1>
        <p className="page-subtitle">Curated links for your R2I journey</p>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">No resources found for "{search}"</div>
      )}

      {filtered.map(cat => (
        <div key={cat.id} className="resource-category">
          <h2 className="resource-cat-title">
            <span>{cat.icon}</span> {cat.title}
          </h2>
          <div className="resource-cards">
            {cat.resources.map(r => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
              >
                <div className="resource-card-top">
                  <span className="resource-title">{r.title}</span>
                  <span className="resource-tag">{r.tag}</span>
                </div>
                <p className="resource-desc">{r.description}</p>
                <span className="resource-link-hint">Open ↗</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
