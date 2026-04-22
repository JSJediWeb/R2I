import { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import Checklist from './components/Checklist'
import Finance from './components/Finance'
import Projection from './components/Projection'
import CityExplorer from './components/CityExplorer'
import Settings from './components/Settings'
import BottomNav from './components/BottomNav'
import type { Tab } from './components/BottomNav'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_FINANCIAL_DATA, DEFAULT_EXCHANGE_RATE } from './data/finance'
import type { FinancialData, NRICountry } from './data/finance'
import './index.css'

type MorePage = 'projection' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [morePage, setMorePage] = useState<MorePage>('settings')
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>('r2i-checklist', {})
  const [moveDate, setMoveDate] = useLocalStorage<string>('r2i-move-date', '')
  const [notes, setNotes] = useLocalStorage<string>('r2i-notes', '')
  const [financialData, setFinancialData] = useLocalStorage<FinancialData>('r2i-finance', DEFAULT_FINANCIAL_DATA)
  const [exchangeRate, setExchangeRate] = useLocalStorage<number>('r2i-exchange-rate', DEFAULT_EXCHANGE_RATE)
  const [country, setCountry] = useLocalStorage<NRICountry>('r2i-country', 'US')

  const toggleItem = useCallback((id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }, [setCheckedItems])

  const handleNav = useCallback((tab: string) => {
    setActiveTab(tab as Tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleResetAll = useCallback(() => {
    setCheckedItems({})
    setMoveDate('')
    setNotes('')
    setFinancialData(DEFAULT_FINANCIAL_DATA)
    setExchangeRate(DEFAULT_EXCHANGE_RATE)
    setCountry('US')
    setActiveTab('dashboard')
  }, [setCheckedItems, setMoveDate, setNotes, setFinancialData, setExchangeRate, setCountry])

  return (
    <div className="app">
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard checkedItems={checkedItems} moveDate={moveDate} onSetMoveDate={setMoveDate} onNav={handleNav} />
        )}
        {activeTab === 'checklist' && (
          <Checklist checkedItems={checkedItems} onToggle={toggleItem} />
        )}
        {activeTab === 'finance' && (
          <Finance data={financialData} rate={exchangeRate} country={country} onUpdate={setFinancialData} onGoSettings={() => handleNav('more')} />
        )}
        {activeTab === 'explore' && (
          <CityExplorer rate={exchangeRate} />
        )}
        {activeTab === 'more' && (
          <MoreHub morePage={morePage} setMorePage={setMorePage} financialData={financialData} exchangeRate={exchangeRate} country={country} moveDate={moveDate} setMoveDate={setMoveDate} setCountry={setCountry} setExchangeRate={setExchangeRate} notes={notes} setNotes={setNotes} onResetAll={handleResetAll} />
        )}
      </main>
      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}

// "More" hub — Projection + Settings in a tabbed panel
type MoreHubProps = {
  morePage: MorePage
  setMorePage: (p: MorePage) => void
  financialData: FinancialData
  exchangeRate: number
  country: NRICountry
  moveDate: string
  setMoveDate: (d: string) => void
  setCountry: (c: NRICountry) => void
  setExchangeRate: (r: number) => void
  notes: string
  setNotes: (n: string) => void
  onResetAll: () => void
}

function MoreHub({ morePage, setMorePage, financialData, exchangeRate, country, moveDate, setMoveDate, setCountry, setExchangeRate, notes, setNotes, onResetAll }: MoreHubProps) {
  return (
    <div>
      <div className="more-tabs">
        <button className={`more-tab ${morePage === 'projection' ? 'active' : ''}`} onClick={() => setMorePage('projection')}>📊 Projection</button>
        <button className={`more-tab ${morePage === 'settings' ? 'active' : ''}`} onClick={() => setMorePage('settings')}>⚙️ Settings</button>
      </div>
      {morePage === 'projection' && (
        <Projection data={financialData} rate={exchangeRate} country={country} />
      )}
      {morePage === 'settings' && (
        <Settings
          rate={exchangeRate}
          onRateChange={setExchangeRate}
          moveDate={moveDate}
          onMoveDateChange={setMoveDate}
          country={country}
          onCountryChange={setCountry}
          notes={notes}
          onNotesUpdate={setNotes}
          onResetAll={onResetAll}
        />
      )}
    </div>
  )
}
