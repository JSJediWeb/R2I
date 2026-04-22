import { useState, useMemo } from 'react'
import type { FinancialData, NRICountry } from '../data/finance'
import { formatINR, formatUSD, toINR, toUSD, indiaReadyTotal, lockedForeignTotal } from '../data/finance'

type ScenarioKey = 'optimistic' | 'base' | 'conservative'

type Scenario = {
  key: ScenarioKey
  label: string
  color: string
  description: string
  corpusReturn: number   // annual % return on remaining corpus
  inflation: number      // annual India inflation %
  currencyDrift: number  // annual INR depreciation vs USD % (positive = INR weakens)
}

const SCENARIOS: Scenario[] = [
  {
    key: 'optimistic',
    label: 'Optimistic',
    color: '#059669',
    description: 'Strong market returns, low inflation, stable currency',
    corpusReturn: 9,
    inflation: 4,
    currencyDrift: 1,
  },
  {
    key: 'base',
    label: 'Base Case',
    color: '#4F46E5',
    description: 'Moderate returns, historical India inflation, typical currency trend',
    corpusReturn: 7,
    inflation: 6,
    currencyDrift: 2.5,
  },
  {
    key: 'conservative',
    label: 'Conservative',
    color: '#DC2626',
    description: 'Lower returns, higher inflation, significant INR weakness',
    corpusReturn: 5,
    inflation: 8,
    currencyDrift: 4,
  },
]

type YearPoint = {
  year: number
  corpusINR: number
  monthlyExpensesINR: number
  depleted: boolean
}

function projectScenario(
  initialCorpusINR: number,
  monthlyExpensesINR: number,
  scenario: Scenario,
  years: number,
): YearPoint[] {
  const points: YearPoint[] = []
  let corpus = initialCorpusINR
  let expenses = monthlyExpensesINR

  for (let y = 0; y <= years; y++) {
    const depleted = corpus <= 0
    points.push({ year: y, corpusINR: Math.max(0, corpus), monthlyExpensesINR: expenses, depleted })
    if (!depleted) {
      const annualExpenses = expenses * 12
      const netGrowth = corpus * (scenario.corpusReturn / 100)
      corpus = corpus + netGrowth - annualExpenses
      expenses = expenses * (1 + scenario.inflation / 100)
    }
  }
  return points
}

type Props = {
  data: FinancialData
  rate: number
  country: NRICountry
}

export default function Projection({ data, rate, country: _country }: Props) {
  const effectiveRate = rate || 84
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('base')
  const [projYears] = useState(25)
  const [showLocked, setShowLocked] = useState(false)
  const [customReturn, setCustomReturn] = useState('')
  const [customInflation, setCustomInflation] = useState('')

  const indiaReadyINR = indiaReadyTotal(data, 'INR', effectiveRate)
  const lockedINR = lockedForeignTotal(data, 'INR', effectiveRate)
  const totalINR = indiaReadyINR + (showLocked ? lockedINR : 0)
  const monthlyExpensesINR = data.targetMonthlyExpenses > 0
    ? toINR(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, effectiveRate)
    : 0

  const scenario = SCENARIOS.find(s => s.key === activeScenario)!
  const effectiveScenario = {
    ...scenario,
    corpusReturn: customReturn ? parseFloat(customReturn) : scenario.corpusReturn,
    inflation: customInflation ? parseFloat(customInflation) : scenario.inflation,
  }

  const projections = useMemo(() => {
    return SCENARIOS.reduce((acc, s) => {
      const sc = s.key === activeScenario ? effectiveScenario : s
      acc[s.key] = projectScenario(totalINR, monthlyExpensesINR || totalINR * 0.04 / 12, sc, projYears)
      return acc
    }, {} as Record<ScenarioKey, YearPoint[]>)
  }, [totalINR, monthlyExpensesINR, effectiveScenario, projYears, activeScenario])

  const activePoints = projections[activeScenario]
  const depletionYear = activePoints.find(p => p.depleted)?.year ?? null
  const maxCorpus = Math.max(...activePoints.map(p => p.corpusINR))

  const hasData = indiaReadyINR > 0 || lockedINR > 0

  return (
    <div className="projection-page">
      <div className="page-header">
        <h1 className="page-title">20-Year Projection</h1>
        <p className="page-subtitle">How long will your corpus last?</p>
      </div>

      {!hasData && (
        <div className="info-banner" style={{ margin: '16px' }}>
          Add your financial data in the Finance tab first to see projections.
        </div>
      )}

      {/* Corpus inputs */}
      <div className="proj-inputs-card">
        <div className="proj-input-row">
          <div className="proj-input-item">
            <div className="proj-input-label">India-Ready Corpus</div>
            <div className="proj-input-val" style={{ color: '#059669' }}>{formatINR(indiaReadyINR)}</div>
            <div className="proj-input-sub">{formatUSD(toUSD(indiaReadyINR, 'INR', effectiveRate))}</div>
          </div>
          <div className="proj-input-item">
            <div className="proj-input-label">Locked Foreign</div>
            <div className="proj-input-val" style={{ color: '#D97706' }}>{formatINR(lockedINR)}</div>
            <div className="proj-input-sub">{formatUSD(toUSD(lockedINR, 'INR', effectiveRate))}</div>
          </div>
        </div>

        <div className="proj-locked-toggle">
          <button className={`toggle-pill ${showLocked ? 'active' : ''}`} onClick={() => setShowLocked(v => !v)}>
            {showLocked ? 'Including locked accounts' : 'Excluding locked accounts'}
          </button>
          <span className="proj-locked-hint">
            {showLocked ? 'Assuming full access to foreign retirement accounts' : 'Conservative: locked accounts not projected'}
          </span>
        </div>

        <div className="proj-input-row" style={{ marginTop: 12 }}>
          <div className="proj-input-item">
            <div className="proj-input-label">Monthly Budget (India)</div>
            <div className="proj-input-val">
              {monthlyExpensesINR > 0 ? formatINR(monthlyExpensesINR) : <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
            </div>
            {monthlyExpensesINR > 0 && <div className="proj-input-sub">Set in Finance tab</div>}
          </div>
          <div className="proj-input-item">
            <div className="proj-input-label">Total Projected</div>
            <div className="proj-input-val">{formatINR(totalINR)}</div>
            <div className="proj-input-sub">{formatUSD(toUSD(totalINR, 'INR', effectiveRate))}</div>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="scenario-tabs">
        {SCENARIOS.map(s => (
          <button
            key={s.key}
            className={`scenario-tab ${activeScenario === s.key ? 'active' : ''}`}
            style={activeScenario === s.key ? { borderColor: s.color, color: s.color, background: `${s.color}12` } : {}}
            onClick={() => setActiveScenario(s.key)}
          >
            <span className="scenario-tab-name">{s.label}</span>
            <span className="scenario-tab-sub">{s.corpusReturn}% return · {s.inflation}% inflation</span>
          </button>
        ))}
      </div>

      {/* Active scenario detail */}
      <div className="scenario-detail-card">
        <div className="scenario-detail-title" style={{ color: scenario.color }}>{scenario.label}</div>
        <p className="scenario-detail-desc">{scenario.description}</p>

        <div className="scenario-params">
          <div className="scenario-param">
            <span className="scenario-param-label">Corpus return</span>
            <input
              type="number"
              className="scenario-param-input"
              placeholder={String(scenario.corpusReturn)}
              value={customReturn}
              onChange={e => setCustomReturn(e.target.value)}
              min="0" max="30" step="0.5"
            />
            <span className="scenario-param-unit">% / yr</span>
          </div>
          <div className="scenario-param">
            <span className="scenario-param-label">India inflation</span>
            <input
              type="number"
              className="scenario-param-input"
              placeholder={String(scenario.inflation)}
              value={customInflation}
              onChange={e => setCustomInflation(e.target.value)}
              min="0" max="20" step="0.5"
            />
            <span className="scenario-param-unit">% / yr</span>
          </div>
          <div className="scenario-param">
            <span className="scenario-param-label">Currency drift</span>
            <div className="scenario-param-static">{scenario.currencyDrift}% / yr</div>
          </div>
        </div>

        {depletionYear != null ? (
          <div className="depletion-warning">
            ⚠️ Corpus depleted in year {depletionYear} — consider increasing savings or reducing expenses
          </div>
        ) : (
          <div className="depletion-ok">
            ✅ Corpus lasts 25+ years in this scenario
          </div>
        )}
      </div>

      {/* Chart */}
      {hasData && monthlyExpensesINR > 0 && (
        <div className="proj-chart-card">
          <div className="proj-chart-title">Corpus over {projYears} years</div>
          <SimpleBarChart points={activePoints} color={scenario.color} maxVal={maxCorpus} />
          <div className="proj-chart-legend">
            <span className="proj-chart-year">Year 0</span>
            <span className="proj-chart-year">Year {Math.floor(projYears / 2)}</span>
            <span className="proj-chart-year">Year {projYears}</span>
          </div>
        </div>
      )}

      {/* Year-by-year table (first 10) */}
      {hasData && monthlyExpensesINR > 0 && (
        <div className="proj-table-card">
          <div className="proj-table-title">Year-by-year breakdown</div>
          <div className="proj-table-header">
            <span>Year</span>
            <span>Corpus</span>
            <span>Monthly Budget</span>
          </div>
          {activePoints.slice(0, 21).map(p => (
            <div key={p.year} className={`proj-table-row ${p.depleted ? 'proj-depleted' : ''}`}>
              <span className="proj-yr">{p.year === 0 ? 'Now' : `Yr ${p.year}`}</span>
              <span className={p.depleted ? 'proj-depleted-text' : 'proj-corpus'}>
                {p.depleted ? '—' : formatINR(p.corpusINR)}
              </span>
              <span className="proj-monthly">{formatINR(p.monthlyExpensesINR)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="proj-disclaimer">
        These projections are illustrative estimates only. Actual returns, inflation, and currency movements may differ significantly. Consult a qualified financial advisor before making major financial decisions.
      </div>
    </div>
  )
}

function SimpleBarChart({ points, color, maxVal }: { points: YearPoint[]; color: string; maxVal: number }) {
  const step = Math.max(1, Math.floor(points.length / 20))
  const displayed = points.filter((_, i) => i % step === 0)

  return (
    <div className="bar-chart">
      {displayed.map(p => {
        const h = maxVal > 0 ? Math.round((p.corpusINR / maxVal) * 100) : 0
        return (
          <div key={p.year} className="bar-col">
            <div className="bar-wrap">
              <div
                className="bar-fill"
                style={{ height: `${h}%`, background: p.depleted ? '#E5E7EB' : color }}
                title={`Year ${p.year}: ${formatINR(p.corpusINR)}`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
