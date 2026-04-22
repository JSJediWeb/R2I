import { useState, useId } from 'react'
import type { FinancialData, FinancialEntry, Currency, AssetType, NRICountry } from '../data/finance'
import {
  DEFAULT_EXCHANGE_RATE, NRI_COUNTRIES,
  formatUSD, formatINR, formatBoth, formatCurrency,
  toUSD, toINR, sectionTotal, totalNetWorth, monthlyRunway,
  indiaReadyTotal, lockedForeignTotal,
} from '../data/finance'

type SectionKey = 'assets' | 'investments' | 'retirement'

const SECTION_META: Record<SectionKey, { label: string; icon: string; color: string; placeholder: string }> = {
  assets: { label: 'Assets', icon: '🏠', color: '#4F46E5', placeholder: 'e.g. Primary Home, Savings Account, Car' },
  investments: { label: 'Investments', icon: '📈', color: '#059669', placeholder: 'e.g. US Stocks, Mutual Funds, Indian MF' },
  retirement: { label: 'Retirement Accounts', icon: '🏦', color: '#D97706', placeholder: 'e.g. 401(k), IRA, RRSP, Super, NPS' },
}

type EntryFormState = { name: string; amount: string; currency: Currency; assetType: AssetType; notes: string }
const EMPTY_FORM: EntryFormState = { name: '', amount: '', currency: 'USD', assetType: 'india_ready', notes: '' }

type Props = {
  data: FinancialData
  rate: number
  country: NRICountry
  onUpdate: (d: FinancialData) => void
  onGoSettings: () => void
}

export default function Finance({ data, rate, country, onUpdate, onGoSettings }: Props) {
  const [openSection, setOpenSection] = useState<SectionKey | 'expenses' | null>('assets')
  const [addingTo, setAddingTo] = useState<SectionKey | null>(null)
  const [editingEntry, setEditingEntry] = useState<{ section: SectionKey; id: string } | null>(null)
  const [form, setForm] = useState<EntryFormState>(EMPTY_FORM)
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'INR'>('USD')
  const formId = useId()

  const effectiveRate = rate || DEFAULT_EXCHANGE_RATE
  const countryMeta = NRI_COUNTRIES.find(c => c.id === country) ?? NRI_COUNTRIES[0]

  const netWorth = totalNetWorth(data, displayCurrency, effectiveRate)
  const indiaReady = indiaReadyTotal(data, displayCurrency, effectiveRate)
  const locked = lockedForeignTotal(data, displayCurrency, effectiveRate)
  const runway = monthlyRunway(data, effectiveRate)

  function fmt(amount: number, currency: Currency) {
    const inINR = toINR(amount, currency, effectiveRate)
    const inUSD = toUSD(amount, currency, effectiveRate)
    return displayCurrency === 'USD' ? formatUSD(inUSD) : formatINR(inINR)
  }

  function startAdd(section: SectionKey) {
    setEditingEntry(null)
    const defaultCurrency: Currency = section === 'retirement' ? countryMeta.currency : 'USD'
    const defaultAssetType: AssetType = section === 'retirement' ? 'locked_foreign' : 'india_ready'
    setForm({ ...EMPTY_FORM, currency: defaultCurrency, assetType: defaultAssetType })
    setAddingTo(section)
    setOpenSection(section)
  }

  function startEdit(section: SectionKey, entry: FinancialEntry) {
    setAddingTo(null)
    setEditingEntry({ section, id: entry.id })
    setForm({ name: entry.name, amount: String(entry.amount), currency: entry.currency, assetType: entry.assetType, notes: entry.notes ?? '' })
    setOpenSection(section)
  }

  function cancelForm() { setAddingTo(null); setEditingEntry(null); setForm(EMPTY_FORM) }

  function saveEntry(section: SectionKey) {
    const amount = parseFloat(form.amount)
    if (!form.name.trim() || isNaN(amount) || amount <= 0) return
    if (editingEntry && editingEntry.section === section) {
      onUpdate({
        ...data,
        [section]: data[section].map(e =>
          e.id === editingEntry.id
            ? { ...e, name: form.name.trim(), amount, currency: form.currency, assetType: form.assetType, notes: form.notes.trim() }
            : e
        ),
      })
    } else {
      const newEntry: FinancialEntry = {
        id: `${section}-${Date.now()}`,
        name: form.name.trim(), amount,
        currency: form.currency, assetType: form.assetType, notes: form.notes.trim(),
      }
      onUpdate({ ...data, [section]: [...data[section], newEntry] })
    }
    cancelForm()
  }

  function removeEntry(section: SectionKey, id: string) {
    onUpdate({ ...data, [section]: data[section].filter(e => e.id !== id) })
  }

  function updateExpenses(amount: string, currency: Currency) {
    const parsed = parseFloat(amount)
    onUpdate({ ...data, targetMonthlyExpenses: isNaN(parsed) ? 0 : parsed, targetMonthlyExpensesCurrency: currency })
  }

  const runwayLabel = runway != null
    ? runway >= 240 ? `${Math.floor(runway / 12)}+ years` : runway >= 12
      ? `${(runway / 12).toFixed(1)} yrs (${runway} mo)` : `${runway} months`
    : null

  const indiaReadyPct = netWorth > 0 ? Math.round((indiaReady / netWorth) * 100) : 0

  return (
    <div className="finance-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Finance</h1>
            <p className="page-subtitle">{countryMeta.flag} {countryMeta.label} → India</p>
          </div>
          <button className="header-icon-btn" onClick={onGoSettings} aria-label="Settings">⚙️</button>
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="fin-summary-card">
        <div className="fin-summary-top">
          <div>
            <div className="fin-summary-label">Total Net Worth</div>
            <div className="fin-summary-value">
              {displayCurrency === 'USD' ? formatUSD(netWorth) : formatINR(netWorth)}
            </div>
            <div className="fin-summary-secondary">
              {displayCurrency === 'USD' ? formatINR(toINR(netWorth, 'USD', effectiveRate)) : formatUSD(toUSD(netWorth, 'INR', effectiveRate))}
            </div>
          </div>
          <div className="fin-currency-toggle">
            <button className={`currency-btn ${displayCurrency === 'USD' ? 'active' : ''}`} onClick={() => setDisplayCurrency('USD')}>$ USD</button>
            <button className={`currency-btn ${displayCurrency === 'INR' ? 'active' : ''}`} onClick={() => setDisplayCurrency('INR')}>₹ INR</button>
          </div>
        </div>

        {/* India-ready vs Locked split */}
        <div className="corpus-split-card">
          <div className="corpus-split-title">Corpus Breakdown</div>
          <div className="corpus-bar-wrap">
            <div className="corpus-bar-fill" style={{ width: `${indiaReadyPct}%` }} />
          </div>
          <div className="corpus-split-row">
            <div className="corpus-split-item">
              <span className="corpus-dot corpus-dot--ready" />
              <div>
                <div className="corpus-item-label">India-Ready</div>
                <div className="corpus-item-value" style={{ color: '#059669' }}>
                  {displayCurrency === 'USD' ? formatUSD(indiaReady) : formatINR(indiaReady)}
                </div>
                <div className="corpus-item-sub">Liquid · accessible now</div>
              </div>
            </div>
            <div className="corpus-split-item">
              <span className="corpus-dot corpus-dot--locked" />
              <div>
                <div className="corpus-item-label">Locked Foreign</div>
                <div className="corpus-item-value" style={{ color: '#D97706' }}>
                  {displayCurrency === 'USD' ? formatUSD(locked) : formatINR(locked)}
                </div>
                <div className="corpus-item-sub">{countryMeta.retirementAccounts[0]}, etc.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="fin-breakdown">
          {(Object.keys(SECTION_META) as SectionKey[]).map(key => {
            const total = sectionTotal(data[key], displayCurrency, effectiveRate)
            return (
              <div key={key} className="fin-breakdown-item">
                <span className="fin-breakdown-icon">{SECTION_META[key].icon}</span>
                <span className="fin-breakdown-name">{SECTION_META[key].label}</span>
                <span className="fin-breakdown-val" style={{ color: SECTION_META[key].color }}>
                  {displayCurrency === 'USD' ? formatUSD(total) : formatINR(total)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="fin-rate-row">
          <span className="fin-rate-label">Exchange rate</span>
          <button className="fin-rate-value" onClick={onGoSettings}>1 USD = ₹{effectiveRate} &nbsp;✏️</button>
        </div>
      </div>

      {/* Monthly Runway (based on India-ready only) */}
      {data.targetMonthlyExpenses > 0 && (
        <div className="fin-runway-card">
          <div className="fin-runway-icon">⏱️</div>
          <div>
            <div className="fin-runway-label">Monthly runway (India-ready corpus)</div>
            <div className="fin-runway-value">{runwayLabel ?? '—'}</div>
            <div className="fin-runway-sub">
              at {formatBoth(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, effectiveRate)}/mo
            </div>
          </div>
        </div>
      )}

      {/* Section blocks */}
      {(Object.keys(SECTION_META) as SectionKey[]).map(key => {
        const meta = SECTION_META[key]
        const entries = data[key]
        const total = sectionTotal(entries, displayCurrency, effectiveRate)
        const isOpen = openSection === key

        return (
          <div key={key} className="fin-section">
            <button className="fin-section-header" style={{ borderLeftColor: meta.color }} onClick={() => setOpenSection(isOpen ? null : key)} aria-expanded={isOpen}>
              <span className="fin-section-icon">{meta.icon}</span>
              <div className="fin-section-info">
                <span className="fin-section-title">{meta.label}</span>
                <span className="fin-section-count">{entries.length} {entries.length === 1 ? 'item' : 'items'}</span>
              </div>
              <span className="fin-section-total" style={{ color: meta.color }}>
                {displayCurrency === 'USD' ? formatUSD(total) : formatINR(total)}
              </span>
              <span className="fin-chevron">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="fin-section-body">
                {entries.length === 0 && addingTo !== key && (
                  <p className="fin-empty">No {meta.label.toLowerCase()} added yet</p>
                )}

                {entries.map(entry => (
                  <div key={entry.id} className="fin-entry">
                    {editingEntry?.section === key && editingEntry.id === entry.id ? (
                      <EntryForm formId={formId} form={form} setForm={setForm} placeholder={meta.placeholder} country={countryMeta} onSave={() => saveEntry(key)} onCancel={cancelForm} />
                    ) : (
                      <>
                        <div className="fin-entry-info">
                          <div className="fin-entry-name-row">
                            <span className="fin-entry-name">{entry.name}</span>
                            <span className={`asset-type-badge ${entry.assetType === 'india_ready' ? 'badge-ready' : 'badge-locked'}`}>
                              {entry.assetType === 'india_ready' ? '✓ India-ready' : '🔒 Locked'}
                            </span>
                          </div>
                          {entry.notes && <span className="fin-entry-notes">{entry.notes}</span>}
                        </div>
                        <div className="fin-entry-right">
                          <span className="fin-entry-original">{formatCurrency(entry.amount, entry.currency)}</span>
                          <span className="fin-entry-converted">{fmt(entry.amount, entry.currency)}</span>
                        </div>
                        <div className="fin-entry-actions">
                          <button className="fin-action-btn" onClick={() => startEdit(key, entry)}>✏️</button>
                          <button className="fin-action-btn" onClick={() => removeEntry(key, entry.id)}>🗑️</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {addingTo === key && (
                  <div className="fin-entry fin-entry-adding">
                    <EntryForm formId={formId} form={form} setForm={setForm} placeholder={meta.placeholder} country={countryMeta} onSave={() => saveEntry(key)} onCancel={cancelForm} />
                  </div>
                )}

                {addingTo !== key && !(editingEntry?.section === key) && (
                  <button className="fin-add-btn" style={{ color: meta.color }} onClick={() => startAdd(key)}>
                    + Add {meta.label.endsWith('s') ? meta.label.slice(0, -1) : meta.label}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Monthly Expenses Target */}
      <div className="fin-section">
        <button className="fin-section-header" style={{ borderLeftColor: '#DB2777' }} onClick={() => setOpenSection(openSection === 'expenses' ? null : 'expenses')} aria-expanded={openSection === 'expenses'}>
          <span className="fin-section-icon">🎯</span>
          <div className="fin-section-info">
            <span className="fin-section-title">Monthly Expenses Target</span>
            <span className="fin-section-count">in India</span>
          </div>
          <span className="fin-section-total" style={{ color: '#DB2777' }}>
            {data.targetMonthlyExpenses > 0 ? formatBoth(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, effectiveRate) : 'Not set'}
          </span>
          <span className="fin-chevron">{openSection === 'expenses' ? '▲' : '▼'}</span>
        </button>

        {openSection === 'expenses' && (
          <div className="fin-section-body">
            <p className="fin-expenses-hint">Set your expected monthly budget in India. The runway above uses only your India-ready corpus.</p>
            <div className="fin-expenses-row">
              <div className="fin-currency-toggle fin-currency-toggle--sm">
                <button className={`currency-btn ${data.targetMonthlyExpensesCurrency === 'INR' ? 'active' : ''}`} onClick={() => updateExpenses(String(data.targetMonthlyExpenses), 'INR')}>₹ INR</button>
                <button className={`currency-btn ${data.targetMonthlyExpensesCurrency === 'USD' ? 'active' : ''}`} onClick={() => updateExpenses(String(data.targetMonthlyExpenses), 'USD')}>$ USD</button>
              </div>
              <input className="fin-amount-input" type="number" placeholder="e.g. 150000" value={data.targetMonthlyExpenses || ''} min="0" onChange={e => updateExpenses(e.target.value, data.targetMonthlyExpensesCurrency)} />
            </div>
            {data.targetMonthlyExpenses > 0 && (
              <div className="fin-expenses-equiv">
                ≈ {data.targetMonthlyExpensesCurrency === 'INR'
                  ? formatUSD(toUSD(data.targetMonthlyExpenses, 'INR', effectiveRate))
                  : formatINR(toINR(data.targetMonthlyExpenses, 'USD', effectiveRate))} / month
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Entry Form ────────────────────────────────────────────────────────────────

type EntryFormProps = {
  formId: string
  form: EntryFormState
  setForm: (f: EntryFormState) => void
  placeholder: string
  country: typeof NRI_COUNTRIES[0]
  onSave: () => void
  onCancel: () => void
}

const ALL_CURRENCIES: Currency[] = ['USD', 'INR', 'CAD', 'GBP', 'AUD']

function EntryForm({ formId, form, setForm, placeholder, country, onSave, onCancel }: EntryFormProps) {
  const valid = form.name.trim().length > 0 && parseFloat(form.amount) > 0

  return (
    <div className="entry-form" id={formId}>
      <input className="entry-form-input" type="text" placeholder={placeholder} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />

      <div className="entry-form-amount-row">
        <select className="entry-form-select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value as Currency })}>
          {ALL_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="fin-amount-input" type="number" placeholder="Amount" value={form.amount} min="0" onChange={e => setForm({ ...form, amount: e.target.value })} />
      </div>

      <div className="entry-form-asset-type">
        <span className="entry-form-label">Asset type:</span>
        <div className="asset-type-toggle">
          <button type="button" className={`asset-type-btn ${form.assetType === 'india_ready' ? 'active-ready' : ''}`} onClick={() => setForm({ ...form, assetType: 'india_ready' })}>
            ✓ India-ready
          </button>
          <button type="button" className={`asset-type-btn ${form.assetType === 'locked_foreign' ? 'active-locked' : ''}`} onClick={() => setForm({ ...form, assetType: 'locked_foreign' })}>
            🔒 Locked ({country.retirementAccounts[0]}, etc.)
          </button>
        </div>
        <p className="entry-form-type-hint">
          {form.assetType === 'india_ready'
            ? 'Liquid savings, property equity, taxable investments — available immediately in India'
            : `Foreign retirement accounts (${country.retirementAccounts.slice(0, 2).join(', ')}) — restricted access, not counted in runway`}
        </p>
      </div>

      <input className="entry-form-input entry-form-input--notes" type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

      <div className="entry-form-actions">
        <button className="entry-form-cancel" type="button" onClick={onCancel}>Cancel</button>
        <button className="entry-form-save" type="button" disabled={!valid} onClick={onSave}>Save</button>
      </div>
    </div>
  )
}
