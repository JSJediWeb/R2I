export type Resource = {
  id: string
  title: string
  description: string
  url: string
  tag: string
}

export type ResourceCategory = {
  id: string
  title: string
  icon: string
  resources: Resource[]
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'community',
    title: 'Community & Forums',
    icon: '👥',
    resources: [
      { id: 'r-1', title: 'R2I Forum', description: 'The original Return to India community with thousands of posts on every aspect of the move', url: 'https://www.r2iclubforums.com', tag: 'Forum' },
      { id: 'r-2', title: 'Facebook: Return to India', description: 'Active Facebook group with daily discussions, questions, and experiences', url: 'https://www.facebook.com/groups/ReturntoIndia', tag: 'Social' },
      { id: 'r-3', title: 'Reddit r/india', description: 'Subreddit for India-related discussions including R2I experiences', url: 'https://www.reddit.com/r/india', tag: 'Forum' },
    ],
  },
  {
    id: 'tax-finance',
    title: 'Tax & Finance',
    icon: '💰',
    resources: [
      { id: 'r-4', title: 'Income Tax India Portal', description: 'Official Indian income tax filing and information portal', url: 'https://www.incometax.gov.in', tag: 'Official' },
      { id: 'r-5', title: 'RBI: FEMA Guidelines', description: 'Reserve Bank of India guidelines on foreign exchange for returning NRIs', url: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx', tag: 'Official' },
      { id: 'r-6', title: 'NRI Tax Advisor', description: 'Dedicated portal for NRI taxation, DTAA, and compliance guidance', url: 'https://www.nritaxation.com', tag: 'Guide' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents & Government',
    icon: '📄',
    resources: [
      { id: 'r-7', title: 'Passport Seva', description: 'Official Indian passport and OCI application portal', url: 'https://www.passportindia.gov.in', tag: 'Official' },
      { id: 'r-8', title: 'UIDAI (Aadhaar)', description: 'Aadhaar card enrollment, update, and download portal', url: 'https://uidai.gov.in', tag: 'Official' },
      { id: 'r-9', title: 'MCA21 (Company Registration)', description: 'Ministry of Corporate Affairs portal for business registration in India', url: 'https://www.mca.gov.in', tag: 'Official' },
    ],
  },
  {
    id: 'housing',
    title: 'Housing & Real Estate',
    icon: '🏘️',
    resources: [
      { id: 'r-10', title: 'MagicBricks', description: 'India\'s leading real estate portal for buying, selling, and renting property', url: 'https://www.magicbricks.com', tag: 'Real Estate' },
      { id: 'r-11', title: '99acres', description: 'Property listings across all major Indian cities with price trends', url: 'https://www.99acres.com', tag: 'Real Estate' },
      { id: 'r-12', title: 'NoBroker', description: 'Zero-brokerage rental and property portal with direct owner listings', url: 'https://www.nobroker.in', tag: 'Real Estate' },
    ],
  },
  {
    id: 'jobs',
    title: 'Jobs & Career',
    icon: '💼',
    resources: [
      { id: 'r-13', title: 'Naukri.com', description: 'India\'s largest job portal with 50M+ jobs across sectors', url: 'https://www.naukri.com', tag: 'Jobs' },
      { id: 'r-14', title: 'LinkedIn India', description: 'Professional networking and job search in India', url: 'https://www.linkedin.com/jobs/india-jobs', tag: 'Jobs' },
      { id: 'r-15', title: 'Internshala', description: 'Jobs, internships, and training programs for career switchers', url: 'https://internshala.com', tag: 'Jobs' },
    ],
  },
  {
    id: 'moving',
    title: 'Shipping & Moving',
    icon: '🚢',
    resources: [
      { id: 'r-16', title: 'CBIC: Transfer of Residence', description: 'Official customs duty exemption guide for returning Indian residents', url: 'https://www.cbic.gov.in/htdocs-cbec/customs/cx-act/moveablegoods.pdf', tag: 'Official' },
      { id: 'r-17', title: 'International Packers India', description: 'Directory of licensed international movers and packers for NRI relocation', url: 'https://www.justdial.com/India/International-Packers-And-Movers', tag: 'Moving' },
    ],
  },
  {
    id: 'schools',
    title: 'Schools & Education',
    icon: '🎓',
    resources: [
      { id: 'r-18', title: 'CBSE School Finder', description: 'Official CBSE portal to search for schools across India', url: 'https://cbse.gov.in/newsite/schoolsearch/index.aspx', tag: 'Education' },
      { id: 'r-19', title: 'AKS (AFS for Expat Kids)', description: 'Resources for children transitioning into Indian school system', url: 'https://www.internationalschoolsearch.com/india', tag: 'Education' },
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: '🏥',
    resources: [
      { id: 'r-20', title: 'Practo', description: 'Find doctors, book appointments, and access health records online in India', url: 'https://www.practo.com', tag: 'Healthcare' },
      { id: 'r-21', title: 'Ayushman Bharat Portal', description: 'India\'s national health insurance scheme information and enrollment', url: 'https://pmjay.gov.in', tag: 'Official' },
      { id: 'r-22', title: 'Star Health Insurance', description: 'Comprehensive health insurance plans for returning NRIs and their families', url: 'https://www.starhealth.in', tag: 'Insurance' },
    ],
  },
]
