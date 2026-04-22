export type Currency = 'USD' | 'INR' | 'CAD' | 'GBP' | 'AUD'
export type NRICountry = 'US' | 'CA' | 'UK' | 'AU' | 'Other'

export const NRI_COUNTRIES: { id: NRICountry; label: string; flag: string; currency: Currency; retirementAccounts: string[] }[] = [
  { id: 'US', label: 'United States', flag: '🇺🇸', currency: 'USD', retirementAccounts: ['401(k)', 'IRA', 'Roth IRA', '403(b)', 'SEP IRA'] },
  { id: 'CA', label: 'Canada', flag: '🇨🇦', currency: 'CAD', retirementAccounts: ['RRSP', 'TFSA', 'RRIF', 'DPSP', 'Pension'] },
  { id: 'UK', label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', retirementAccounts: ['SIPP', 'ISA', 'Workplace Pension', 'QROPS', 'State Pension'] },
  { id: 'AU', label: 'Australia', flag: '🇦🇺', currency: 'AUD', retirementAccounts: ['Superannuation', 'SMSF', 'Industry Fund'] },
  { id: 'Other', label: 'Other', flag: '🌍', currency: 'USD', retirementAccounts: ['Pension', 'Retirement Account'] },
]

// Exchange rates relative to USD (approximate defaults)
export const DEFAULT_CROSS_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 84,
  CAD: 0.74,
  GBP: 1.27,
  AUD: 0.65,
}

export type AssetType = 'india_ready' | 'locked_foreign'

export type FinancialEntry = {
  id: string
  name: string
  amount: number
  currency: Currency
  assetType: AssetType  // india_ready = can be used immediately; locked_foreign = retirement accts, restricted
  notes?: string
}

export type FinancialData = {
  assets: FinancialEntry[]
  investments: FinancialEntry[]
  retirement: FinancialEntry[]
  targetMonthlyExpenses: number
  targetMonthlyExpensesCurrency: Currency
}

export const DEFAULT_FINANCIAL_DATA: FinancialData = {
  assets: [],
  investments: [],
  retirement: [],
  targetMonthlyExpenses: 0,
  targetMonthlyExpensesCurrency: 'INR',
}

export const DEFAULT_EXCHANGE_RATE = 84 // 1 USD = 84 INR

// Convert any currency to USD using cross-rates
export function toUSDFromCurrency(amount: number, from: Currency, crossRates: Record<Currency, number>): number {
  if (from === 'USD') return amount
  if (from === 'INR') return amount / crossRates.INR
  return amount * crossRates[from]
}

export function toUSD(amount: number, currency: Currency, rate: number): number {
  if (currency === 'USD') return amount
  if (currency === 'INR') return amount / rate
  const cross = DEFAULT_CROSS_RATES[currency]
  return amount * cross
}

export function toINR(amount: number, currency: Currency, rate: number): number {
  if (currency === 'INR') return amount
  const usd = toUSD(amount, currency, rate)
  return usd * rate
}

export function formatCurrency(amount: number, currency: Currency): string {
  switch (currency) {
    case 'INR': return formatINR(amount)
    case 'USD': return formatUSD(amount)
    case 'CAD': return `CA$${(amount / 1000).toFixed(1)}K`
    case 'GBP': return `£${(amount / 1000).toFixed(1)}K`
    case 'AUD': return `A$${(amount / 1000).toFixed(1)}K`
  }
}

export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  return `$${Math.round(amount).toLocaleString('en-US')}`
}

export function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

export function formatBoth(amount: number, currency: Currency, rate: number): string {
  const usd = toUSD(amount, currency, rate)
  const inr = toINR(amount, currency, rate)
  return `${formatUSD(usd)}  ·  ${formatINR(inr)}`
}

export function sectionTotal(entries: FinancialEntry[], currency: Currency, rate: number): number {
  return entries.reduce((sum, e) => sum + (currency === 'USD' ? toUSD(e.amount, e.currency, rate) : toINR(e.amount, e.currency, rate)), 0)
}

export function indiaReadyTotal(data: FinancialData, currency: Currency, rate: number): number {
  const all = [...data.assets, ...data.investments, ...data.retirement].filter(e => e.assetType === 'india_ready')
  return sectionTotal(all, currency, rate)
}

export function lockedForeignTotal(data: FinancialData, currency: Currency, rate: number): number {
  const all = [...data.assets, ...data.investments, ...data.retirement].filter(e => e.assetType === 'locked_foreign')
  return sectionTotal(all, currency, rate)
}

export function totalNetWorth(data: FinancialData, currency: Currency, rate: number): number {
  const all = [...data.assets, ...data.investments, ...data.retirement]
  return sectionTotal(all, currency, rate)
}

export function monthlyRunway(data: FinancialData, rate: number): number | null {
  if (!data.targetMonthlyExpenses) return null
  // Use India-ready corpus for runway (locked accounts shouldn't be counted)
  const indiaReadyINR = indiaReadyTotal(data, 'INR', rate)
  const monthlyINR = toINR(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, rate)
  if (!monthlyINR) return null
  return Math.floor(indiaReadyINR / monthlyINR)
}
