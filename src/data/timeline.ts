export type TimelineTask = {
  id: string
  text: string
  category: string
}

export type TimelinePhase = {
  id: string
  label: string
  timeframe: string
  color: string
  tasks: TimelineTask[]
}

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 'phase-1',
    label: 'Decision & Research',
    timeframe: '18–24 months before',
    color: '#4F46E5',
    tasks: [
      { id: 't1-1', text: 'Define your "why" and make the family decision', category: 'Planning' },
      { id: 't1-2', text: 'Research cities – cost of living, job market, lifestyle', category: 'Research' },
      { id: 't1-3', text: 'Visit India for a scouting trip if possible', category: 'Research' },
      { id: 't1-4', text: 'Join R2I online communities and talk to returnees', category: 'Networking' },
      { id: 't1-5', text: 'Create a rough budget for the move', category: 'Finance' },
      { id: 't1-6', text: 'Research school options and waitlists for kids', category: 'Education' },
    ],
  },
  {
    id: 'phase-2',
    label: 'Plan & Prepare',
    timeframe: '12–18 months before',
    color: '#0891B2',
    tasks: [
      { id: 't2-1', text: 'Narrow down city and neighborhood choices', category: 'Planning' },
      { id: 't2-2', text: 'Start school applications for children', category: 'Education' },
      { id: 't2-3', text: 'Begin reducing possessions – sell, donate, declutter', category: 'Moving' },
      { id: 't2-4', text: 'Start building India-based professional network', category: 'Career' },
      { id: 't2-5', text: 'Open/activate Indian bank accounts', category: 'Finance' },
      { id: 't2-6', text: 'Renew Indian passport if needed', category: 'Documents' },
      { id: 't2-7', text: 'Consult CA/tax advisor for transition year planning', category: 'Tax' },
    ],
  },
  {
    id: 'phase-3',
    label: 'Action & Book',
    timeframe: '6–12 months before',
    color: '#059669',
    tasks: [
      { id: 't3-1', text: 'Secure job / income source in India', category: 'Career' },
      { id: 't3-2', text: 'Shortlist and visit rental properties virtually or in-person', category: 'Housing' },
      { id: 't3-3', text: 'Get quotes from international movers', category: 'Moving' },
      { id: 't3-4', text: 'Book flights for the move date', category: 'Logistics' },
      { id: 't3-5', text: 'Apostille critical documents', category: 'Documents' },
      { id: 't3-6', text: 'Research and buy India health insurance', category: 'Health' },
      { id: 't3-7', text: 'Full medical and dental checkups', category: 'Health' },
      { id: 't3-8', text: 'Begin packing non-essentials for shipment', category: 'Moving' },
    ],
  },
  {
    id: 'phase-4',
    label: 'Finalize & Close',
    timeframe: '1–6 months before',
    color: '#D97706',
    tasks: [
      { id: 't4-1', text: 'Sign lease / close on home in India', category: 'Housing' },
      { id: 't4-2', text: 'Book international moving company and schedule pickup', category: 'Moving' },
      { id: 't4-3', text: 'Give notice at current job (if applicable)', category: 'Career' },
      { id: 't4-4', text: 'Cancel or transfer US/foreign subscriptions and memberships', category: 'Logistics' },
      { id: 't4-5', text: 'Notify USPS / postal service of international forwarding', category: 'Logistics' },
      { id: 't4-6', text: 'Transfer or close foreign accounts', category: 'Finance' },
      { id: 't4-7', text: 'Send ocean freight shipment', category: 'Moving' },
      { id: 't4-8', text: 'Say goodbyes and host farewell gatherings', category: 'Personal' },
    ],
  },
  {
    id: 'phase-5',
    label: 'Arrival & Settle',
    timeframe: '0–3 months after',
    color: '#DC2626',
    tasks: [
      { id: 't5-1', text: 'Set up temporary accommodation', category: 'Housing' },
      { id: 't5-2', text: 'Get Indian SIM card and Aadhaar linkages', category: 'Logistics' },
      { id: 't5-3', text: 'Open resident bank account and switch NRE/NRO accounts', category: 'Finance' },
      { id: 't5-4', text: 'Enroll kids in school', category: 'Education' },
      { id: 't5-5', text: 'Receive and clear ocean freight shipment', category: 'Moving' },
      { id: 't5-6', text: 'Register with local authorities, update Aadhaar address', category: 'Documents' },
      { id: 't5-7', text: 'Set up home – utilities, internet, domestic help', category: 'Housing' },
      { id: 't5-8', text: 'Explore neighborhood, build local social circle', category: 'Personal' },
    ],
  },
  {
    id: 'phase-6',
    label: 'Establish & Thrive',
    timeframe: '3–12 months after',
    color: '#7C3AED',
    tasks: [
      { id: 't6-1', text: 'File Indian income tax return for transition year', category: 'Tax' },
      { id: 't6-2', text: 'File final foreign tax return', category: 'Tax' },
      { id: 't6-3', text: 'Report foreign assets in Schedule FA', category: 'Tax' },
      { id: 't6-4', text: 'Build local professional and social network', category: 'Career' },
      { id: 't6-5', text: 'Explore local culture, food, and travel within India', category: 'Personal' },
      { id: 't6-6', text: 'Reassess financial plan for India context', category: 'Finance' },
      { id: 't6-7', text: 'Celebrate – you did it!', category: 'Personal' },
    ],
  },
]
