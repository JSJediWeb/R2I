import { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard'
import Checklist from './components/Checklist'
import Timeline from './components/Timeline'
import Resources from './components/Resources'
import Notes from './components/Notes'
import BottomNav from './components/BottomNav'
import { useLocalStorage } from './hooks/useLocalStorage'
import './index.css'

type Tab = 'dashboard' | 'checklist' | 'timeline' | 'resources' | 'notes'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>('r2i-checklist', {})
  const [moveDate, setMoveDate] = useLocalStorage<string>('r2i-move-date', '')
  const [notes, setNotes] = useLocalStorage<string>('r2i-notes', '')

  const toggleItem = useCallback((id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }, [setCheckedItems])

  const handleNav = useCallback((tab: string) => {
    setActiveTab(tab as Tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
        {activeTab === 'timeline' && <Timeline moveDate={moveDate} />}
        {activeTab === 'resources' && <Resources />}
        {activeTab === 'notes' && <Notes notes={notes} onUpdate={setNotes} />}
      </main>
      <BottomNav active={activeTab} onNav={handleNav} />
    </div>
  )
}
