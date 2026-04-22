import { useState, useMemo } from 'react'
import { CITIES, CITY_TIERS, REGIONS, totalMonthlyExpense } from '../data/cities'
import type { City, CityTier, Region } from '../data/cities'
import { formatINR, formatUSD, toUSD } from '../data/finance'

type BHK = 1 | 2 | 3

type ExpenseRowKey = 'rent' | 'groceries' | 'diningOut' | 'transport' | 'utilities' | 'school' | 'healthcare' | 'housekeeping' | 'entertainment'

type Props = {
  rate: number
}

const EXPENSE_ROWS: { key: ExpenseRowKey; label: string; icon: string }[] = [
  { key: 'rent', label: 'Rent', icon: '🏠' },
  { key: 'groceries', label: 'Groceries', icon: '🛒' },
  { key: 'diningOut', label: 'Dining Out', icon: '🍽️' },
  { key: 'transport', label: 'Transport', icon: '🚗' },
  { key: 'utilities', label: 'Utilities', icon: '💡' },
  { key: 'school', label: 'School', icon: '🎒' },
  { key: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { key: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
  { key: 'entertainment', label: 'Entertainment', icon: '🎬' },
]

type ExpenseRowData = Record<ExpenseRowKey, number>

function expenseRows(city: City, bhk: BHK, hasKids: boolean, intlSchool: boolean): ExpenseRowData {
  const rent = bhk === 1 ? city.expenses.rent1bhk : bhk === 2 ? city.expenses.rent2bhk : city.expenses.rent3bhk
  return {
    rent,
    groceries: city.expenses.groceries,
    diningOut: city.expenses.diningOut,
    transport: city.expenses.transport,
    utilities: city.expenses.utilities,
    school: hasKids ? (intlSchool ? city.expenses.schoolIntl : city.expenses.schoolCbse) : 0,
    healthcare: city.expenses.healthcare,
    housekeeping: city.expenses.housekeeping,
    entertainment: city.expenses.entertainment,
  }
}

const TIER_COLORS: Record<CityTier, string> = {
  Metro: '#4F46E5',
  'Tier 2': '#059669',
  'Tier 3': '#D97706',
}

export default function CityExplorer({ rate }: Props) {
  const [view, setView] = useState<'browse' | 'detail' | 'compare'>('browse')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [compareCity, setCompareCity] = useState<City | null>(null)
  const [filterTier, setFilterTier] = useState<CityTier | 'All'>('All')
  const [filterRegion, setFilterRegion] = useState<Region>('All')
  const [search, setSearch] = useState('')
  const [bhk, setBhk] = useState<BHK>(2)
  const [hasKids, setHasKids] = useState(false)
  const [intlSchool, setIntlSchool] = useState(false)
  const [showUSD, setShowUSD] = useState(false)

  const effectiveRate = rate || 84

  function fmt(inr: number) {
    return showUSD ? formatUSD(toUSD(inr, 'INR', effectiveRate)) : formatINR(inr)
  }

  const filtered = useMemo(() => {
    return CITIES.filter(c => {
      if (filterTier !== 'All' && c.tier !== filterTier) return false
      if (filterRegion !== 'All' && c.region !== filterRegion) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.state.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [filterTier, filterRegion, search])

  function openCity(city: City) {
    setSelectedCity(city)
    setView('detail')
  }

  if (view === 'detail' && selectedCity) {
    const rows = expenseRows(selectedCity, bhk, hasKids, intlSchool)
    const total = totalMonthlyExpense(selectedCity.expenses, bhk, hasKids, intlSchool)

    return (
      <div className="city-detail">
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="page-title">{selectedCity.name}</h1>
              <p className="page-subtitle">{selectedCity.state}</p>
            </div>
            <button className="header-icon-btn" onClick={() => setView('browse')}>✕</button>
          </div>
        </div>

        <div className="city-detail-body">
          <div className="city-tier-badge" style={{ background: TIER_COLORS[selectedCity.tier] }}>
            {selectedCity.tier}
          </div>

          <p className="city-description">{selectedCity.description}</p>

          <div className="city-meta-row">
            <span className="city-meta-item">🌤️ {selectedCity.weatherSummary}</span>
            <span className="city-meta-item">🗣️ {selectedCity.languages.join(', ')}</span>
            <span className="city-meta-item">📍 {selectedCity.popularAreas.slice(0, 3).join(' · ')}</span>
          </div>

          <div className="pros-cons-grid">
            <div className="pros-block">
              <div className="pros-cons-title">✅ Pros</div>
              {selectedCity.pros.map((p, i) => <div key={i} className="pro-item">{p}</div>)}
            </div>
            <div className="cons-block">
              <div className="pros-cons-title">⚠️ Cons</div>
              {selectedCity.cons.map((c, i) => <div key={i} className="con-item">{c}</div>)}
            </div>
          </div>

          {/* Expense configurator */}
          <div className="expense-config-card">
            <div className="expense-config-title">Monthly Expense Calculator</div>
            <div className="expense-config-row">
              <span className="expense-config-label">BHK size</span>
              <div className="bhk-toggle">
                {([1, 2, 3] as BHK[]).map(b => (
                  <button key={b} className={`bhk-btn ${bhk === b ? 'active' : ''}`} onClick={() => setBhk(b)}>{b}BHK</button>
                ))}
              </div>
            </div>
            <div className="expense-config-row">
              <span className="expense-config-label">Kids in school</span>
              <button className={`toggle-pill ${hasKids ? 'active' : ''}`} onClick={() => setHasKids(v => !v)}>
                {hasKids ? 'Yes' : 'No'}
              </button>
            </div>
            {hasKids && (
              <div className="expense-config-row">
                <span className="expense-config-label">School type</span>
                <div className="bhk-toggle">
                  <button className={`bhk-btn ${!intlSchool ? 'active' : ''}`} onClick={() => setIntlSchool(false)}>CBSE/ICSE</button>
                  <button className={`bhk-btn ${intlSchool ? 'active' : ''}`} onClick={() => setIntlSchool(true)}>IB/IGCSE</button>
                </div>
              </div>
            )}
            <div className="expense-config-row">
              <span className="expense-config-label">Show in</span>
              <div className="bhk-toggle">
                <button className={`bhk-btn ${!showUSD ? 'active' : ''}`} onClick={() => setShowUSD(false)}>₹ INR</button>
                <button className={`bhk-btn ${showUSD ? 'active' : ''}`} onClick={() => setShowUSD(true)}>$ USD</button>
              </div>
            </div>
          </div>

          {/* Expense breakdown */}
          <div className="expense-breakdown-card">
            <div className="expense-total-row">
              <span className="expense-total-label">Total Monthly</span>
              <span className="expense-total-value">{fmt(total)}</span>
            </div>
            {EXPENSE_ROWS.map(({ key, label, icon }) => {
              const val = rows[key]
              if (!val) return null
              const pct = Math.round((val / total) * 100)
              return (
                <div key={key} className="expense-row">
                  <span className="expense-row-icon">{icon}</span>
                  <span className="expense-row-label">{label}</span>
                  <div className="expense-row-bar-wrap">
                    <div className="expense-row-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="expense-row-val">{fmt(val)}</span>
                </div>
              )
            })}
          </div>

          <button
            className="cta-btn"
            style={{ margin: '0 0 8px' }}
            onClick={() => {
              setCompareCity(selectedCity)
              setView('compare')
            }}
          >
            Compare with Another City
          </button>
          <button className="link-btn" style={{ display: 'block', textAlign: 'center', padding: '8px' }} onClick={() => setView('browse')}>
            ← Back to all cities
          </button>
        </div>
      </div>
    )
  }

  if (view === 'compare') {
    const cityA = compareCity
    const cityB = selectedCity !== compareCity ? selectedCity : null

    return (
      <div className="compare-page">
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Compare Cities</h1>
              <p className="page-subtitle">Side-by-side cost comparison</p>
            </div>
            <button className="header-icon-btn" onClick={() => setView('browse')}>✕</button>
          </div>
        </div>

        <div className="compare-body">
          {/* Config */}
          <div className="compare-config">
            <div className="expense-config-row">
              <span className="expense-config-label">BHK</span>
              <div className="bhk-toggle">
                {([1, 2, 3] as BHK[]).map(b => (
                  <button key={b} className={`bhk-btn ${bhk === b ? 'active' : ''}`} onClick={() => setBhk(b)}>{b}BHK</button>
                ))}
              </div>
            </div>
            <div className="expense-config-row">
              <span className="expense-config-label">Kids</span>
              <button className={`toggle-pill ${hasKids ? 'active' : ''}`} onClick={() => setHasKids(v => !v)}>{hasKids ? 'Yes' : 'No'}</button>
              {hasKids && (
                <div className="bhk-toggle" style={{ marginLeft: 8 }}>
                  <button className={`bhk-btn ${!intlSchool ? 'active' : ''}`} onClick={() => setIntlSchool(false)}>CBSE</button>
                  <button className={`bhk-btn ${intlSchool ? 'active' : ''}`} onClick={() => setIntlSchool(true)}>IB</button>
                </div>
              )}
              <div className="bhk-toggle" style={{ marginLeft: 'auto' }}>
                <button className={`bhk-btn ${!showUSD ? 'active' : ''}`} onClick={() => setShowUSD(false)}>₹</button>
                <button className={`bhk-btn ${showUSD ? 'active' : ''}`} onClick={() => setShowUSD(true)}>$</button>
              </div>
            </div>
          </div>

          {/* City pickers */}
          <div className="compare-cities-row">
            <CityPicker label="City A" value={cityA} onChange={setCompareCity} exclude={cityB?.id} />
            <div className="compare-vs">VS</div>
            <CityPicker label="City B" value={cityB} onChange={setSelectedCity} exclude={cityA?.id} />
          </div>

          {/* Comparison table */}
          {cityA && cityB && (
            <CompareTable cityA={cityA} cityB={cityB} bhk={bhk} hasKids={hasKids} intlSchool={intlSchool} fmt={fmt} />
          )}

          <button className="link-btn" style={{ display: 'block', textAlign: 'center', padding: '16px' }} onClick={() => setView('browse')}>
            ← Back to all cities
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="city-explorer">
      <div className="page-header">
        <h1 className="page-title">City Explorer</h1>
        <p className="page-subtitle">{CITIES.length} cities · cost of living data</p>
      </div>

      <div className="city-filters">
        <div className="search-wrap" style={{ margin: '0 0 12px' }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" type="search" placeholder="Search city or state..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="filter-tabs">
          {(['All', ...CITY_TIERS] as const).map(t => (
            <button key={t} className={`filter-tab ${filterTier === t ? 'active' : ''}`} onClick={() => setFilterTier(t)}>{t}</button>
          ))}
        </div>
        <div className="filter-tabs" style={{ marginTop: 8 }}>
          {REGIONS.map(r => (
            <button key={r} className={`filter-tab ${filterRegion === r ? 'active' : ''}`} onClick={() => setFilterRegion(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="city-list">
        {filtered.length === 0 && <div className="empty-state">No cities match your filters</div>}
        {filtered.map(city => {
          const total = totalMonthlyExpense(city.expenses, bhk, hasKids, intlSchool)
          return (
            <button key={city.id} className="city-card" onClick={() => openCity(city)}>
              <div className="city-card-top">
                <div>
                  <div className="city-card-name">{city.name}</div>
                  <div className="city-card-state">{city.state}</div>
                </div>
                <div className="city-card-right">
                  <span className="city-tier-badge" style={{ background: TIER_COLORS[city.tier] }}>{city.tier}</span>
                  <div className="city-card-cost">{formatINR(total)}/mo</div>
                </div>
              </div>
              <p className="city-card-desc">{city.description.slice(0, 90)}…</p>
              <div className="city-card-areas">{city.popularAreas.slice(0, 3).join(' · ')}</div>
            </button>
          )
        })}
      </div>

      {/* Quick config floating bar */}
      <div className="city-config-bar">
        <span className="city-config-label">BHK:</span>
        {([1, 2, 3] as BHK[]).map(b => (
          <button key={b} className={`bhk-btn-sm ${bhk === b ? 'active' : ''}`} onClick={() => setBhk(b)}>{b}</button>
        ))}
        <button className={`toggle-pill-sm ${hasKids ? 'active' : ''}`} onClick={() => setHasKids(v => !v)}>
          {hasKids ? '👶 Kids' : '👤 No kids'}
        </button>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CityPicker({ label, value, onChange, exclude }: { label: string; value: City | null; onChange: (c: City) => void; exclude?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="city-picker">
      <div className="city-picker-label">{label}</div>
      <button className="city-picker-btn" onClick={() => setOpen(v => !v)}>
        {value ? value.name : 'Select city'} ▾
      </button>
      {open && (
        <div className="city-picker-dropdown">
          {CITIES.filter(c => c.id !== exclude).map(c => (
            <button key={c.id} className="city-picker-option" onClick={() => { onChange(c); setOpen(false) }}>
              {c.name}<span className="city-picker-state"> {c.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CompareTable({ cityA, cityB, bhk, hasKids, intlSchool, fmt }: { cityA: City; cityB: City; bhk: BHK; hasKids: boolean; intlSchool: boolean; fmt: (n: number) => string }) {
  const rowsA = expenseRows(cityA, bhk, hasKids, intlSchool)
  const rowsB = expenseRows(cityB, bhk, hasKids, intlSchool)
  const totalA = totalMonthlyExpense(cityA.expenses, bhk, hasKids, intlSchool)
  const totalB = totalMonthlyExpense(cityB.expenses, bhk, hasKids, intlSchool)
  const cheaper = totalA <= totalB ? 'A' : 'B'

  return (
    <div className="compare-table-card">
      <div className="compare-header-row">
        <div className="compare-col-label"></div>
        <div className="compare-city-col">
          <div className="compare-city-name">{cityA.name}</div>
          <div className="compare-city-tier" style={{ color: TIER_COLORS[cityA.tier] }}>{cityA.tier}</div>
        </div>
        <div className="compare-city-col">
          <div className="compare-city-name">{cityB.name}</div>
          <div className="compare-city-tier" style={{ color: TIER_COLORS[cityB.tier] }}>{cityB.tier}</div>
        </div>
      </div>

      {EXPENSE_ROWS.map(({ key, label, icon }) => {
        const a = rowsA[key], b = rowsB[key]
        if (!a && !b) return null
        const lower = a <= b ? 'A' : 'B'
        return (
          <div key={key} className="compare-row">
            <div className="compare-col-label"><span>{icon}</span> {label}</div>
            <div className={`compare-val ${lower === 'A' ? 'compare-lower' : ''}`}>{fmt(a)}</div>
            <div className={`compare-val ${lower === 'B' ? 'compare-lower' : ''}`}>{fmt(b)}</div>
          </div>
        )
      })}

      <div className="compare-total-row">
        <div className="compare-col-label">Total/mo</div>
        <div className={`compare-total-val ${cheaper === 'A' ? 'compare-winner' : ''}`}>{fmt(totalA)}</div>
        <div className={`compare-total-val ${cheaper === 'B' ? 'compare-winner' : ''}`}>{fmt(totalB)}</div>
      </div>

      <div className="compare-savings">
        {cheaper === 'A' ? cityA.name : cityB.name} is {fmt(Math.abs(totalA - totalB))}/mo cheaper
        {' '}(saving {fmt(Math.abs(totalA - totalB) * 12)}/year)
      </div>
    </div>
  )
}
