export type Currency = 'USD' | 'INR'

export type FinancialEntry = {
  id: string
  name: string
  amount: number
  currency: Currency
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

export function toUSD(amount: number, currency: Currency, rate: number): number {
  return currency === 'USD' ? amount : amount / rate
}

export function toINR(amount: number, currency: Currency, rate: number): number {
  return currency === 'INR' ? amount : amount * rate
}

export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatBoth(amount: number, currency: Currency, rate: number): string {
  const usd = toUSD(amount, currency, rate)
  const inr = toINR(amount, currency, rate)
  return `${formatUSD(usd)}  ·  ${formatINR(inr)}`
}

export function sectionTotal(entries: FinancialEntry[], currency: Currency, rate: number): number {
  return entries.reduce((sum, e) => sum + (currency === 'USD' ? toUSD(e.amount, e.currency, rate) : toINR(e.amount, e.currency, rate)), 0)
}

export function totalNetWorth(data: FinancialData, currency: Currency, rate: number): number {
  const all = [...data.assets, ...data.investments, ...data.retirement]
  return sectionTotal(all, currency, rate)
}

export function monthlyRunway(data: FinancialData, rate: number): number | null {
  if (!data.targetMonthlyExpenses) return null
  const netWorthINR = totalNetWorth(data, 'INR', rate)
  const monthlyINR = toINR(data.targetMonthlyExpenses, data.targetMonthlyExpensesCurrency, rate)
  if (!monthlyINR) return null
  return Math.floor(netWorthINR / monthlyINR)
}
