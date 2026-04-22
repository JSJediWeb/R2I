import { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import Checklist from './components/Checklist'
import Finance from './components/Finance'
import Timeline from './components/Timeline'
import Settings from './components/Settings'
import BottomNav from './components/BottomNav'
import type { Tab } from './components/BottomNav'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_FINANCIAL_DATA, DEFAULT_EXCHANGE_RATE } from './data/finance'
import type { FinancialData } from './data/finance'
import './index.css'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>('r2i-checklist', {})
  const [moveDate, setMoveDate] = useLocalStorage<string>('r2i-move-date', '')
  const [notes, setNotes] = useLocalStorage<string>('r2i-notes', '')
  const [financialData, setFinancialData] = useLocalStorage<FinancialData>('r2i-finance', DEFAULT_FINANCIAL_DATA)
  const [exchangeRate, setExchangeRate] = useLocalStorage<number>('r2i-exchange-rate', DEFAULT_EXCHANGE_RATE)

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
    setActiveTab('dashboard')
  }, [setCheckedItems, setMoveDate, setNotes, setFinancialData, setExchangeRate])

  return (
    <div className="app">
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            checkedItems={checkedItems}
            moveDate={moveDate}
            onSetMoveDate={setMoveDate}
            onNav={handleNav}
          />
        )}
        {activeTab === 'checklist' && (
          <Checklist checkedItems={checkedItems} onToggle={toggleItem} />
        )}
        {activeTab === 'finance' && (
          <Finance
            data={financialData}
            rate={exchangeRate}
            onUpdate={setFinancialData}
            onGoSettings={() => handleNav('settings')}
          />
        )}
        {activeTab === 'timeline' && <Timeline moveDate={moveDate} />}
        {activeTab === 'settings' && (
          <Settings
            rate={exchangeRate}
            onRateChange={setExchangeRate}
            moveDate={moveDate}
            onMoveDateChange={setMoveDate}
            notes={notes}
            onNotesUpdate={setNotes}
            onResetAll={handleResetAll}
          />
        )}
      </main>
      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}
