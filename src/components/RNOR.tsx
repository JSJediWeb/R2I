import { useState, useMemo } from 'react'

type RNORStatus = 'NRI' | 'RNOR' | 'ROR'

function calcRNORStatus(moveDate: string, yearsAbroad: number): {
  status: RNORStatus
  explanation: string
  rnorEnds: string | null
  taxBenefits: string[]
  actionItems: string[]
} {
  if (!moveDate || yearsAbroad < 0) {
    return { status: 'NRI', explanation: 'Enter your details above to see your status.', rnorEnds: null, taxBenefits: [], actionItems: [] }
  }

  const returnDate = new Date(moveDate)
  const today = new Date()
  const alreadyReturned = returnDate <= today

  // RNOR rules (simplified):
  // Person qualifies as RNOR if:
  //   (a) NRI in 9 out of 10 preceding years, OR
  //   (b) India presence <= 729 days in 7 preceding years
  // RNOR period typically lasts 2–3 years after return

  // India days in last 7 years (rough proxy from years abroad)
  const indiaStayDays7yr = Math.max(0, 7 * 365 - yearsAbroad * 365)
  const nriIn9of10 = yearsAbroad >= 9

  const qualifiesRNOR = nriIn9of10 || indiaStayDays7yr <= 729

  if (!alreadyReturned) {
    // Project status at move date
    const futureYearsAbroad = yearsAbroad + (returnDate.getFullYear() - today.getFullYear())
    const willQualify = futureYearsAbroad >= 9 || indiaStayDays7yr <= 729
    const rnorEndDate = new Date(returnDate)
    rnorEndDate.setFullYear(rnorEndDate.getFullYear() + 2)

    if (willQualify) {
      return {
        status: 'RNOR',
        explanation: `When you return on your planned date, you'll likely qualify as Resident but Not Ordinarily Resident (RNOR) — a transitional tax status that lasts ~2 years.`,
        rnorEnds: rnorEndDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
        taxBenefits: [
          'Foreign income (salary, dividends, capital gains) earned outside India is NOT taxable in India during RNOR period',
          'NRE account interest remains tax-free during RNOR',
          'Foreign assets need not be reported as resident global income',
          'DTAA (Double Tax Avoidance) protections still apply',
        ],
        actionItems: [
          `Plan large foreign income events (stock vesting, asset sales) BEFORE your RNOR window closes (~${rnorEndDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })})`,
          'Convert NRE/NRO accounts after confirming RNOR period — keep NRE interest tax-free as long as possible',
          'File Schedule FA (foreign assets) starting from the year you become ROR',
          'Consult CA for optimizing 401k/RRSP withdrawals during RNOR window',
          'Track India stay days carefully — exceeding limits can change your status',
        ],
      }
    }
    return {
      status: 'ROR',
      explanation: 'Based on your stay history, you may become a Resident and Ordinarily Resident (ROR) immediately upon return — global income becomes taxable in India.',
      rnorEnds: null,
      taxBenefits: [],
      actionItems: [
        'Immediately report all global income to Indian IT authorities',
        'Convert NRE accounts to resident savings accounts',
        'File Schedule FA for all foreign assets',
        'Ensure DTAA filings are complete to avoid double taxation',
      ],
    }
  }

  // Already returned
  const returnYear = returnDate.getFullYear()
  const currentYear = today.getFullYear()
  const yearsBack = currentYear - returnYear

  if (qualifiesRNOR && yearsBack < 2) {
    const rnorEndDate = new Date(returnDate)
    rnorEndDate.setFullYear(rnorEndDate.getFullYear() + 2)
    const isExpiringSoon = rnorEndDate.getTime() - today.getTime() < 180 * 24 * 60 * 60 * 1000
    return {
      status: 'RNOR',
      explanation: `You are currently RNOR${isExpiringSoon ? ' — your window is closing soon!' : ''}. Your RNOR status ends around ${rnorEndDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}.`,
      rnorEnds: rnorEndDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }),
      taxBenefits: [
        'Foreign income earned outside India is still NOT taxable in India',
        'NRE fixed deposits continue earning tax-free interest',
        'Foreign pension/retirement distributions may be exempt (check DTAA)',
        'No need to report foreign assets as global income yet',
      ],
      actionItems: isExpiringSoon ? [
        '⚡ URGENT: Plan any remaining foreign income events before RNOR ends',
        'Schedule 401k/RRSP withdrawals during remaining RNOR window',
        'Prepare to file Schedule FA from next year',
        'Consult CA now — window is under 6 months',
      ] : [
        'Maximize foreign income events while RNOR status holds',
        'Begin preparing for full ROR compliance',
        'Keep accurate records of all foreign income',
        'Consult CA to optimize tax planning before RNOR ends',
      ],
    }
  }

  return {
    status: 'ROR',
    explanation: 'You are now a Resident and Ordinarily Resident (ROR). All global income — including foreign dividends, interest, and retirement distributions — is taxable in India.',
    rnorEnds: null,
    taxBenefits: [],
    actionItems: [
      'File Schedule FA every year — disclose all foreign bank accounts, investments, and retirement accounts',
      'Report 401k/RRSP/Super withdrawals as income; claim DTAA relief to avoid double tax',
      'NRE account interest becomes taxable once you are ROR — convert to resident account',
      'Track FBAR/FATCA obligations if you maintain US accounts',
      'Consult CA for optimal foreign asset drawdown strategy',
    ],
  }
}

type Props = {
  moveDate: string
  onMoveDateChange: (d: string) => void
}

const STATUS_COLORS: Record<RNORStatus, string> = {
  NRI: '#4F46E5',
  RNOR: '#D97706',
  ROR: '#059669',
}

const STATUS_DESCRIPTIONS: Record<RNORStatus, { title: string; subtitle: string }> = {
  NRI: { title: 'Non-Resident Indian', subtitle: 'Foreign income taxed in country of residence, not India' },
  RNOR: { title: 'Resident but Not Ordinarily Resident', subtitle: 'Transitional status — foreign income still exempt for ~2 years' },
  ROR: { title: 'Resident and Ordinarily Resident', subtitle: 'Global income fully taxable in India' },
}

export default function RNOR({ moveDate, onMoveDateChange }: Props) {
  const [yearsAbroad, setYearsAbroad] = useState('')

  const result = useMemo(() => calcRNORStatus(moveDate, parseInt(yearsAbroad) || 0), [moveDate, yearsAbroad])
  const color = STATUS_COLORS[result.status]
  const meta = STATUS_DESCRIPTIONS[result.status]

  return (
    <div className="rnor-page">
      <div className="page-header">
        <h1 className="page-title">RNOR Planner</h1>
        <p className="page-subtitle">Optimize your tax transition window</p>
      </div>

      {/* What is RNOR */}
      <div className="rnor-explainer-card">
        <div className="rnor-explainer-title">What is RNOR?</div>
        <p className="rnor-explainer-text">
          When you return to India after living abroad for many years, Indian tax law gives you a transitional grace period called <strong>RNOR (Resident but Not Ordinarily Resident)</strong> — typically lasting 1–3 years. During this window, your foreign-sourced income is <strong>not taxable in India</strong>, giving you time to wind down foreign finances tax-efficiently.
        </p>
        <p className="rnor-explainer-text" style={{ marginTop: 8 }}>
          Planning your return date and financial events around the RNOR window can save you significant taxes on 401k/RRSP withdrawals, vesting RSUs, foreign dividends, and property sales.
        </p>
      </div>

      {/* Inputs */}
      <div className="rnor-inputs-card">
        <div className="rnor-input-group">
          <label className="rnor-input-label">Planned return date</label>
          <input
            type="date"
            className="date-input"
            value={moveDate}
            onChange={e => onMoveDateChange(e.target.value)}
            min="2020-01-01"
          />
        </div>
        <div className="rnor-input-group">
          <label className="rnor-input-label">Years lived abroad (approx.)</label>
          <input
            type="number"
            className="rnor-number-input"
            placeholder="e.g. 12"
            value={yearsAbroad}
            min="1" max="40"
            onChange={e => setYearsAbroad(e.target.value)}
          />
        </div>
      </div>

      {/* Status badge */}
      {(moveDate || yearsAbroad) && (
        <>
          <div className="rnor-status-card" style={{ borderColor: color }}>
            <div className="rnor-status-badge" style={{ background: color }}>
              {result.status}
            </div>
            <div className="rnor-status-title">{meta.title}</div>
            <div className="rnor-status-subtitle">{meta.subtitle}</div>
            <p className="rnor-status-explanation">{result.explanation}</p>
            {result.rnorEnds && (
              <div className="rnor-window-row">
                <span className="rnor-window-label">RNOR window closes ~</span>
                <span className="rnor-window-date" style={{ color }}>{result.rnorEnds}</span>
              </div>
            )}
          </div>

          {result.taxBenefits.length > 0 && (
            <div className="rnor-section-card">
              <div className="rnor-section-title">💰 Tax Benefits During RNOR</div>
              {result.taxBenefits.map((b, i) => (
                <div key={i} className="rnor-benefit-item">
                  <span className="rnor-bullet" style={{ background: color }} />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rnor-section-card">
            <div className="rnor-section-title">✅ Action Items</div>
            {result.actionItems.map((a, i) => (
              <div key={i} className="rnor-action-item">
                <span className="rnor-action-num" style={{ background: color }}>{i + 1}</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RNOR qualification rules */}
      <div className="rnor-rules-card">
        <div className="rnor-rules-title">📋 RNOR Qualification Rules</div>
        <div className="rnor-rule">
          <div className="rnor-rule-title">Rule A — NRI history</div>
          <div className="rnor-rule-text">You were NRI (non-resident) in India for 9 out of the 10 years immediately preceding the current year</div>
        </div>
        <div className="rnor-rule">
          <div className="rnor-rule-title">Rule B — Limited India stay</div>
          <div className="rnor-rule-text">Your total stay in India during the 7 years preceding the current year was 729 days or less</div>
        </div>
        <div className="rnor-rule" style={{ borderBottom: 'none' }}>
          <div className="rnor-rule-title">Duration</div>
          <div className="rnor-rule-text">RNOR status typically lasts 1–3 years after return. Once you satisfy both conditions of becoming ROR (resident for 2+ consecutive years AND stay &gt; 730 days in 7 years), you become ROR.</div>
        </div>
        <div className="rnor-disclaimer">
          ⚠️ Tax laws are complex and subject to change. This is a simplified guide only. Always consult a qualified CA/tax advisor for your specific situation.
        </div>
      </div>
    </div>
  )
}
