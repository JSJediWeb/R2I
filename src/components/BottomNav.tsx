export type Tab = 'dashboard' | 'checklist' | 'finance' | 'explore' | 'more'

type NavItem = { id: Tab; label: string; icon: string }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'explore', label: 'Explore', icon: '🗺️' },
  { id: 'more', label: 'More', icon: '☰' },
]

type Props = { active: Tab; onNav: (t: Tab) => void }

export default function BottomNav({ active, onNav }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'nav-active' : ''}`}
          onClick={() => onNav(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
