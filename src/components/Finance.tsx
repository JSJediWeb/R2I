import { useState, useId } from 'react'
import type { FinancialData, FinancialEntry, Currency } from '../data/finance'
import {
  DEFAULT_EXCHANGE_RATE,
  formatUSD, formatINR, formatBoth,
  toUSD, toINR, sectionTotal, totalNetWorth, monthlyRunway,
} from '../data/finance'

type SectionKey = 'assets' | 'investments' | 'retirement'

const SECTION_META: Record<SectionKey, { label: string; icon: string; color: string; placeholder: string }> = {
  assets: {
    label: 'Assets',
    icon: '🏠',
    color: '#4F46E5',
    placeholder: 'e.g. Primary Home, Savings Account, Car',
  },
  investments: {
    label: 'Investments',
    icon: '📈',
    color: '#059669',
    placeholder: 'e.g. US Stocks, Mutual Funds, Crypto',
  },
  retirement: {
    label: 'Retirement Accounts',
    icon: '🏦',
    color: '#D97706',
    placeholder: 'e.g. 401(k), IRA, NPS, EPF',
  },
}

type Props = {
  data: FinancialData
  rate: number
  onUpdate: (d: FinancialData) => void
  onGoSettings: () => void
}

type EntryFormState = { name: string; amount: string; currency: Currency; notes: string }
const EMPTY_FORM: EntryFormState = { name: '', amount: '', currency: 'USD', notes: '' }

export default function Finance({ data, rate, onUpdate, onGoSettings }: Props) {
  const [openSection, setOpenSection] = useState<SectionKey | 'expenses' | null>('assets')
  const [addingTo, setAddingTo] = useState<SectionKey | null>(null)
  const [editingEntry, setEditingEntry] = useState<{ section: SectionKey; id: string } | null>(null)
  const [form, setForm] = useState<EntryFormState>(EMPTY_FORM)
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('USD')
  const formId = useId()

  const effectiveRate = rate || DEFAULT_EXCHANGE_RATE

  const netWorth = totalNetWorth(data, displayCurrency, effectiveRate)
  const runway = monthlyRunway(data, effectiveRate)

  function fmt(amount: number, currency: Currency) {
    return displayCurrency === 'USD' ? formatUSD(toUSD(amount, currency, effectiveRate)) : formatINR(toINR(amount, currency, effectiveRate))
  }

  function startAdd(section: SectionKey) {
    setEditingEntry(null)
    setForm(EMPTY_FORM)
    setAddingTo(section)
    setOpenSection(section)
  }

  function startEdit(section: SectionKey, entry: FinancialEntry) {
    setAddingTo(null)
    setEditingEntry({ section, id: entry.id })
    setForm({ name: entry.name, amount: String(entry.amount), currency: entry.currency, notes: entry.notes ?? '' })
    setOpenSection(section)
  }

  function cancelForm() {
    setAddingTo(null)
    setEditingEntry(null)
    setForm(EMPTY_FORM)
  }

  function saveEntry(section: SectionKey) {
    const amount = parseFloat(form.amount)
    if (!form.name.trim() || isNaN(amount) || amount <= 0) return

    if (editingEntry && editingEntry.section === section) {
      onUpdate({
        ...data,
        [section]: data[section].map(e =>
          e.id === editingEntry.id
            ? { ...e, name: form.name.trim(), amount, currency: form.currency, notes: form.notes.trim() }
            : e
        ),
      })
    } else {
      const newEntry: FinancialEntry = {
        id: `${section}-${Date.now()}`,
        name: form.name.trim(),
        amount,
        currency: form.currency,
        notes: form.notes.trim(),
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
    onUpdate({
      ...data,
      targetMonthlyExpenses: isNaN(parsed) ? 0 : parsed,
      targetMonthlyExpensesCurrency: currency,
    })
  }

  const runwayLabel = runway != null
    ? runway >= 240 ? `${(runway / 12).toFixed(0)}+ years` : runway >= 12
      ? `${(runway / 12).toFixed(1)} yrs (${runway} mo)` : `${runway} months`
    : null

  return (
    <div className="finance-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Finance</h1>
            <p className="page-subtitle">Your R2I financial snapshot</p>
          </div>
          <button className="header-icon-btn" onClick={onGoSettings} aria-label="Exchange rate settings">
            <span className="header-icon">⚙️</span>
          </button>
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
            <button
              className={`currency-btn ${displayCurrency === 'USD' ? 'active' : ''}`}
              onClick={() => setDisplayCurrency('USD')}
            >$ USD</button>
            <button
              className={`currency-btn ${displayCurrency === 'INR' ? 'active' : ''}`}
              onClick={() => setDisplayCurrency('INR')}
            >₹ INR</button>
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
          <button className="fin-rate-value" onClick={onGoSettings}>
            1 USD = ₹{effectiveRate.toLocaleString()} &nbsp;✏️
          </button>
        </div>
      </div>

      {/* Monthly Runway */}
      {(data.targetMonthlyExpenses > 0) && (
        <div className="fin-runway-card">
          <div className="fin-runway-icon">⏱️</div>
          <div>
            <div className="fin-runway-label">Monthly runway in India</div>
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
            <button
              className="fin-section-header"
              style={{ borderLeftColor: meta.color }}
              onClick={() => setOpenSection(isOpen ? null : key)}
              aria-expanded={isOpen}
            >
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
                      <EntryForm
                        formId={formId}
                        form={form}
                        setForm={setForm}
                        placeholder={meta.placeholder}
                        onSave={() => saveEntry(key)}
                        onCancel={cancelForm}
                      />
                    ) : (
                      <>
                        <div className="fin-entry-info">
                          <span className="fin-entry-name">{entry.name}</span>
                          {entry.notes && <span className="fin-entry-notes">{entry.notes}</span>}
                        </div>
                        <div className="fin-entry-right">
                          <span className="fin-entry-original">
                            {entry.currency === 'USD' ? formatUSD(entry.amount) : formatINR(entry.amount)}
                          </span>
                          <span className="fin-entry-converted">
                            {fmt(entry.amount, entry.currency)}
                          </span>
                        </div>
                        <div className="fin-entry-actions">
                          <button className="fin-action-btn edit" onClick={() => startEdit(key, entry)}>✏️</button>
                          <button className="fin-action-btn delete" onClick={() => removeEntry(key, entry.id)}>🗑️</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {addingTo === key && (
                  <div className="fin-entry fin-entry-adding">
                    <EntryForm
                      formId={formId}
                      form={form}
                      setForm={setForm}
                      placeholder={meta.placeholder}
                      onSave={() => saveEntry(key)}
                      onCancel={cancelForm}
                    />
                  </div>
                )}

                {addingTo !== key && !(editingEntry?.section === key) && (
                  <button className="fin-add-btn" style={{ color: meta.color }} onClick={() => startAdd(key)}>
                    + Add {meta.label.slice(0, -1)}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Monthly Expenses Target */}
      <div className="fin-section">
        <button
          className="fin-section-header"
          style={{ borderLeftColor: '#DB2777' }}
          onClick={() => setOpenSection(openSection === 'expenses' ? null : 'expenses')}
          aria-expanded={openSection === 'expenses'}
        >
          <span className="fin-section-icon">🎯</span>
          <div className="fin-section-info">
            <span className="fin-section-title">Monthly Expenses Target</span>
            <span className="fin-section-count">in India</span>
          </div>
          <span className="fin-section-total" style={{ color: '#DB2777' }}>
            {data.targetMonthlyExpenses > 0
              ? formatBoth(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, effectiveRate)
              : 'Not set'}
          </span>
          <span className="fin-chevron">{openSection === 'expenses' ? '▲' : '▼'}</span>
        </button>

        {openSection === 'expenses' && (
          <div className="fin-section-body">
            <p className="fin-expenses-hint">Set your expected monthly budget in India to calculate how long your savings will last.</p>
            <div className="fin-expenses-row">
              <div className="fin-currency-toggle fin-currency-toggle--sm">
                <button
                  className={`currency-btn ${data.targetMonthlyExpensesCurrency === 'INR' ? 'active' : ''}`}
                  onClick={() => updateExpenses(String(data.targetMonthlyExpenses), 'INR')}
                >₹ INR</button>
                <button
                  className={`currency-btn ${data.targetMonthlyExpensesCurrency === 'USD' ? 'active' : ''}`}
                  onClick={() => updateExpenses(String(data.targetMonthlyExpenses), 'USD')}
                >$ USD</button>
              </div>
              <input
                type="number"
                className="fin-amount-input"
                placeholder="e.g. 150000"
                value={data.targetMonthlyExpenses || ''}
                min="0"
                onChange={e => updateExpenses(e.target.value, data.targetMonthlyExpensesCurrency)}
              />
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

type EntryFormProps = {
  formId: string
  form: EntryFormState
  setForm: (f: EntryFormState) => void
  placeholder: string
  onSave: () => void
  onCancel: () => void
}

function EntryForm({ formId, form, setForm, placeholder, onSave, onCancel }: EntryFormProps) {
  const valid = form.name.trim().length > 0 && parseFloat(form.amount) > 0

  return (
    <div className="entry-form" id={formId}>
      <input
        className="entry-form-input"
        type="text"
        placeholder={placeholder}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        autoFocus
      />
      <div className="entry-form-amount-row">
        <div className="fin-currency-toggle fin-currency-toggle--sm">
          <button
            className={`currency-btn ${form.currency === 'USD' ? 'active' : ''}`}
            type="button"
            onClick={() => setForm({ ...form, currency: 'USD' })}
          >$ USD</button>
          <button
            className={`currency-btn ${form.currency === 'INR' ? 'active' : ''}`}
            type="button"
            onClick={() => setForm({ ...form, currency: 'INR' })}
          >₹ INR</button>
        </div>
        <input
          className="fin-amount-input"
          type="number"
          placeholder="Amount"
          value={form.amount}
          min="0"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
      </div>
      <input
        className="entry-form-input entry-form-input--notes"
        type="text"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
      />
      <div className="entry-form-actions">
        <button className="entry-form-cancel" type="button" onClick={onCancel}>Cancel</button>
        <button className="entry-form-save" type="button" disabled={!valid} onClick={onSave}>Save</button>
      </div>
    </div>
  )
}
