export type ChecklistItem = {
  id: string
  text: string
  detail?: string
  done: boolean
}

export type ChecklistCategory = {
  id: string
  title: string
  icon: string
  color: string
  items: ChecklistItem[]
}

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'documents',
    title: 'Documents & Identity',
    icon: '🪪',
    color: '#4F46E5',
    items: [
      { id: 'doc-1', text: 'Renew Indian passport (if expiring within 2 years)', done: false },
      { id: 'doc-2', text: 'Apply for OCI card (if not already obtained)', done: false },
      { id: 'doc-3', text: 'Collect original degree certificates & transcripts', done: false },
      { id: 'doc-4', text: 'Apostille foreign documents (marriage cert, birth cert)', done: false },
      { id: 'doc-5', text: 'Get employment letters / experience certificates', done: false },
      { id: 'doc-6', text: 'Obtain police clearance certificate', done: false },
      { id: 'doc-7', text: 'Compile medical records and vaccination history', done: false },
      { id: 'doc-8', text: 'Driver\'s license – get IDP or plan to convert in India', done: false },
    ],
  },
  {
    id: 'banking',
    title: 'Banking & Finance',
    icon: '🏦',
    color: '#059669',
    items: [
      { id: 'bank-1', text: 'Convert NRE/NRO accounts to resident savings accounts', done: false },
      { id: 'bank-2', text: 'Open a resident Indian savings account', done: false },
      { id: 'bank-3', text: 'Close or maintain foreign bank accounts as needed', done: false },
      { id: 'bank-4', text: 'File FBAR / FATCA disclosures for the final year', done: false },
      { id: 'bank-5', text: 'Transfer funds – understand TCS rules for large remittances', done: false },
      { id: 'bank-6', text: 'Update KYC across all Indian accounts', done: false },
      { id: 'bank-7', text: 'Review and repatriate foreign investments if needed', done: false },
      { id: 'bank-8', text: 'Set up UPI / Indian digital payments', done: false },
      { id: 'bank-9', text: 'Apply for credit card in India (build credit history)', done: false },
    ],
  },
  {
    id: 'tax',
    title: 'Tax & Legal',
    icon: '📋',
    color: '#DC2626',
    items: [
      { id: 'tax-1', text: 'File final US/foreign tax return (report departure date)', done: false },
      { id: 'tax-2', text: 'Update RNOR / NRI to Resident status with Indian IT Dept', done: false },
      { id: 'tax-3', text: 'Link Aadhaar with PAN card', done: false },
      { id: 'tax-4', text: 'Understand India tax residency rules (182-day rule)', done: false },
      { id: 'tax-5', text: 'File Indian IT returns for the transition year', done: false },
      { id: 'tax-6', text: 'Consult CA for foreign asset reporting (Schedule FA)', done: false },
      { id: 'tax-7', text: 'Update address on all investment / demat accounts', done: false },
      { id: 'tax-8', text: 'Review Double Taxation Avoidance Agreement (DTAA)', done: false },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    icon: '🏠',
    color: '#D97706',
    items: [
      { id: 'house-1', text: 'Decide city and neighborhood', done: false },
      { id: 'house-2', text: 'Research rental vs. buying options', done: false },
      { id: 'house-3', text: 'Set up temporary accommodation for first month', done: false },
      { id: 'house-4', text: 'Research property prices in target areas', done: false },
      { id: 'house-5', text: 'Connect with local real estate agents', done: false },
      { id: 'house-6', text: 'Understand housing society rules and maintenance charges', done: false },
      { id: 'house-7', text: 'Check broadband / fiber internet availability', done: false },
      { id: 'house-8', text: 'Set up utilities (electricity, water, gas)', done: false },
    ],
  },
  {
    id: 'moving',
    title: 'Shipping & Moving',
    icon: '📦',
    color: '#7C3AED',
    items: [
      { id: 'move-1', text: 'Research international shipping companies', done: false },
      { id: 'move-2', text: 'Get quotes from 3+ packers & movers', done: false },
      { id: 'move-3', text: 'Understand customs duty exemptions (Transfer of Residence)', done: false },
      { id: 'move-4', text: 'Prepare detailed inventory for customs', done: false },
      { id: 'move-5', text: 'Ship or sell large appliances (voltage 110V→220V issue)', done: false },
      { id: 'move-6', text: 'Decide what to ship, sell, donate, or store', done: false },
      { id: 'move-7', text: 'Book air freight for urgent / precious items', done: false },
      { id: 'move-8', text: 'Track and receive shipment in India + customs clearance', done: false },
    ],
  },
  {
    id: 'career',
    title: 'Career & Business',
    icon: '💼',
    color: '#0891B2',
    items: [
      { id: 'career-1', text: 'Research job market in target city and domain', done: false },
      { id: 'career-2', text: 'Update resume for Indian job market format', done: false },
      { id: 'career-3', text: 'Network with professionals on LinkedIn India groups', done: false },
      { id: 'career-4', text: 'Explore remote work / freelance options', done: false },
      { id: 'career-5', text: 'Research startup ecosystem if planning to start a business', done: false },
      { id: 'career-6', text: 'Understand ESOP / stock options tax implications', done: false },
      { id: 'career-7', text: 'Get salary benchmarks for India market', done: false },
    ],
  },
  {
    id: 'kids',
    title: 'Kids & Education',
    icon: '🎒',
    color: '#DB2777',
    items: [
      { id: 'kids-1', text: 'Research schools (CBSE, ICSE, IB, IGCSE)', done: false },
      { id: 'kids-2', text: 'Collect school transcripts and report cards', done: false },
      { id: 'kids-3', text: 'Apply to shortlisted schools (some have 1-2 year waitlists)', done: false },
      { id: 'kids-4', text: 'Prepare kids emotionally for the transition', done: false },
      { id: 'kids-5', text: 'Research extracurricular options (sports, arts)', done: false },
      { id: 'kids-6', text: 'Plan for language transition if kids don\'t speak local language', done: false },
    ],
  },
  {
    id: 'health',
    title: 'Healthcare',
    icon: '🏥',
    color: '#16A34A',
    items: [
      { id: 'health-1', text: 'Get complete medical checkups before leaving', done: false },
      { id: 'health-2', text: 'Stock 6-month supply of prescription medications', done: false },
      { id: 'health-3', text: 'Research health insurance options in India', done: false },
      { id: 'health-4', text: 'Find doctors / specialists in target city (ask your network)', done: false },
      { id: 'health-5', text: 'Understand CGHS / Ayushman Bharat coverage', done: false },
      { id: 'health-6', text: 'Dental checkup and treatments before leaving', done: false },
      { id: 'health-7', text: 'Mental health resources – prepare for reverse culture shock', done: false },
    ],
  },
  {
    id: 'logistics',
    title: 'Daily Life Logistics',
    icon: '🛵',
    color: '#EA580C',
    items: [
      { id: 'log-1', text: 'Get Aadhaar card (or update address)', done: false },
      { id: 'log-2', text: 'Get Indian mobile SIM card', done: false },
      { id: 'log-3', text: 'Research vehicle options – buy car or use app-based transport', done: false },
      { id: 'log-4', text: 'Join local R2I communities / Facebook groups', done: false },
      { id: 'log-5', text: 'Learn / refresh local language if needed', done: false },
      { id: 'log-6', text: 'Set up grocery delivery and essential apps', done: false },
      { id: 'log-7', text: 'Explore domestic help options (maids, drivers, cooks)', done: false },
      { id: 'log-8', text: 'Register with local municipality / voter ID', done: false },
    ],
  },
]
