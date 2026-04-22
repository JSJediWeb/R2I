export type CityTier = 'Metro' | 'Tier 2' | 'Tier 3'

export type ExpenseProfile = {
  rent1bhk: number
  rent2bhk: number
  rent3bhk: number
  groceries: number       // monthly for family of 3–4
  diningOut: number       // 4 restaurant meals/month
  transport: number       // car fuel + auto/cab
  utilities: number       // electricity, water, internet, gas
  schoolCbse: number      // per month per child, good CBSE school
  schoolIntl: number      // per month per child, IB/IGCSE/Cambridge
  healthcare: number      // avg monthly (insurance + misc OOP)
  housekeeping: number    // maid + cook (if applicable)
  entertainment: number   // streaming, gym, outings
}

export type City = {
  id: string
  name: string
  state: string
  tier: CityTier
  region: string
  description: string
  pros: string[]
  cons: string[]
  expenses: ExpenseProfile
  weatherSummary: string
  languages: string[]
  popularAreas: string[]
}

// All expense figures in INR per month (2024–25 estimates)
export const CITIES: City[] = [
  // ── METROS ────────────────────────────────────────────────────────────────
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    tier: 'Metro',
    region: 'West',
    description: 'India\'s financial capital. Highest COL but unmatched career opportunities and cosmopolitan lifestyle.',
    pros: ['Best job market', 'World-class infrastructure', 'Great nightlife & dining', 'Strong NRI network', 'International airport hub'],
    cons: ['Very high rent', 'Traffic & commute', 'Humidity & space crunch', 'Expensive schooling'],
    weatherSummary: 'Hot & humid year-round, heavy monsoon Jun–Sep',
    languages: ['Marathi', 'Hindi', 'English'],
    popularAreas: ['Bandra', 'Powai', 'Andheri', 'Thane', 'Navi Mumbai'],
    expenses: {
      rent1bhk: 35000, rent2bhk: 65000, rent3bhk: 110000,
      groceries: 18000, diningOut: 14000, transport: 12000,
      utilities: 7000, schoolCbse: 10000, schoolIntl: 40000,
      healthcare: 8000, housekeeping: 12000, entertainment: 8000,
    },
  },
  {
    id: 'bangalore',
    name: 'Bengaluru',
    state: 'Karnataka',
    tier: 'Metro',
    region: 'South',
    description: 'India\'s Silicon Valley. Top choice for tech professionals returning from abroad. Pleasant climate year-round.',
    pros: ['Huge tech job market', 'Pleasant weather', 'Vibrant expat/NRI community', 'Good international schools', 'Startup ecosystem'],
    cons: ['Terrible traffic', 'Water shortage', 'Rent rising fast', 'Infrastructure strain'],
    weatherSummary: 'Pleasant year-round (15–30°C), light rain Jun–Sep & Oct–Nov',
    languages: ['Kannada', 'English', 'Hindi', 'Tamil'],
    popularAreas: ['Whitefield', 'HSR Layout', 'Koramangala', 'Indiranagar', 'Electronic City'],
    expenses: {
      rent1bhk: 22000, rent2bhk: 42000, rent3bhk: 72000,
      groceries: 15000, diningOut: 12000, transport: 10000,
      utilities: 5500, schoolCbse: 9000, schoolIntl: 35000,
      healthcare: 6000, housekeeping: 10000, entertainment: 7000,
    },
  },
  {
    id: 'delhi',
    name: 'Delhi / NCR',
    state: 'Delhi',
    tier: 'Metro',
    region: 'North',
    description: 'Political and cultural capital. Huge job market across sectors, excellent connectivity.',
    pros: ['Large job market', 'Best metro connectivity', 'Cultural richness', 'Good CBSE schools', 'Close to hills'],
    cons: ['Air pollution (Oct–Feb)', 'Extreme summers', 'Traffic', 'Safety concerns in some areas'],
    weatherSummary: 'Extreme summers (45°C), cold winters, foggy Jan–Feb, good Oct–Nov',
    languages: ['Hindi', 'English', 'Punjabi'],
    popularAreas: ['Gurgaon', 'Noida', 'Dwarka', 'South Delhi', 'Faridabad'],
    expenses: {
      rent1bhk: 20000, rent2bhk: 38000, rent3bhk: 65000,
      groceries: 14000, diningOut: 11000, transport: 10000,
      utilities: 5000, schoolCbse: 8500, schoolIntl: 32000,
      healthcare: 6500, housekeeping: 9000, entertainment: 7000,
    },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tier: 'Metro',
    region: 'South',
    description: 'Rapidly growing tech hub with comparatively affordable housing. Strong IT sector, excellent food.',
    pros: ['Affordable for a metro', 'Growing IT sector', 'Good infrastructure (Gachibowli)', 'Rich food culture', 'Stable government'],
    cons: ['Extreme summers', 'Water issues', 'Limited metro connectivity', 'Traffic around IT corridors'],
    weatherSummary: 'Very hot summers (42°C), mild winters, monsoon Jul–Sep',
    languages: ['Telugu', 'Urdu', 'Hindi', 'English'],
    popularAreas: ['Gachibowli', 'Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Kondapur'],
    expenses: {
      rent1bhk: 16000, rent2bhk: 28000, rent3bhk: 48000,
      groceries: 12000, diningOut: 9000, transport: 8000,
      utilities: 4500, schoolCbse: 7500, schoolIntl: 28000,
      healthcare: 5500, housekeeping: 8000, entertainment: 5500,
    },
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    tier: 'Metro',
    region: 'South',
    description: 'South India\'s industrial and automotive hub. Strong Tamil culture, good quality of life.',
    pros: ['Strong job market (auto, IT, manufacturing)', 'Good hospitals', 'Great seafood & cuisine', 'Well-planned areas'],
    cons: ['Very hot & humid', 'Language barrier for non-Tamil speakers', 'Water scarcity', 'Limited nightlife'],
    weatherSummary: 'Hot & humid year-round, cyclones Nov–Dec, NE monsoon Oct–Dec',
    languages: ['Tamil', 'English', 'Telugu'],
    popularAreas: ['OMR', 'Anna Nagar', 'Velachery', 'Porur', 'Sholinganallur'],
    expenses: {
      rent1bhk: 15000, rent2bhk: 27000, rent3bhk: 46000,
      groceries: 12000, diningOut: 9000, transport: 8000,
      utilities: 4500, schoolCbse: 7000, schoolIntl: 28000,
      healthcare: 6000, housekeeping: 8000, entertainment: 5000,
    },
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    tier: 'Metro',
    region: 'West',
    description: 'Oxford of the East. Growing IT hub, pleasant climate, younger demographic, close to Mumbai.',
    pros: ['Pleasant climate', 'Growing tech sector', 'Good universities', 'Lower cost than Mumbai', 'Cultural vibrancy'],
    cons: ['Traffic worsening', 'Water shortage in summer', 'Infrastructure lagging growth'],
    weatherSummary: 'Pleasant year-round, moderate monsoon, cool winters',
    languages: ['Marathi', 'Hindi', 'English'],
    popularAreas: ['Baner', 'Kothrud', 'Viman Nagar', 'Hinjewadi', 'Wakad'],
    expenses: {
      rent1bhk: 16000, rent2bhk: 28000, rent3bhk: 48000,
      groceries: 12000, diningOut: 9500, transport: 8000,
      utilities: 4500, schoolCbse: 7500, schoolIntl: 28000,
      healthcare: 5500, housekeeping: 8500, entertainment: 6000,
    },
  },
  // ── TIER 2 ────────────────────────────────────────────────────────────────
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    tier: 'Tier 2',
    region: 'West',
    description: 'Gujarat\'s commercial capital. Business-friendly, great infrastructure, strong Gujarati community.',
    pros: ['Business-friendly environment', 'Excellent infrastructure (metro, roads)', 'Strong business community', 'Relatively affordable'],
    cons: ['Very hot summers', 'Dry (no alcohol readily available)', 'Limited nightlife', 'Hazy winters'],
    weatherSummary: 'Very hot summers (44°C), mild winters, monsoon Jun–Sep',
    languages: ['Gujarati', 'Hindi', 'English'],
    popularAreas: ['SG Highway', 'Prahlad Nagar', 'Bodakdev', 'Satellite', 'Navrangpura'],
    expenses: {
      rent1bhk: 12000, rent2bhk: 22000, rent3bhk: 38000,
      groceries: 10000, diningOut: 7000, transport: 7000,
      utilities: 4000, schoolCbse: 6000, schoolIntl: 22000,
      healthcare: 5000, housekeeping: 7000, entertainment: 4500,
    },
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    tier: 'Tier 2',
    region: 'South',
    description: 'Kerala\'s business hub. Very high NRI concentration, good quality of life, strong healthcare.',
    pros: ['Huge NRI community', 'Excellent healthcare', 'Clean & green', 'Good literacy & safety', 'Coastal lifestyle'],
    cons: ['High humidity', 'Heavy monsoon flooding', 'Limited big-city job market', 'Traffic in city center'],
    weatherSummary: 'Hot & humid, two monsoon seasons, cooler Nov–Feb',
    languages: ['Malayalam', 'English', 'Hindi'],
    popularAreas: ['Kakkanad', 'Aluva', 'Edappally', 'Marine Drive', 'Thrippunithura'],
    expenses: {
      rent1bhk: 12000, rent2bhk: 22000, rent3bhk: 38000,
      groceries: 12000, diningOut: 8000, transport: 7000,
      utilities: 4500, schoolCbse: 6500, schoolIntl: 22000,
      healthcare: 5500, housekeeping: 7500, entertainment: 5000,
    },
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    tier: 'Tier 2',
    region: 'North',
    description: 'The Pink City. Growing IT sector, affordable lifestyle, rich heritage, good climate in winter.',
    pros: ['Very affordable', 'Rich culture & heritage', 'Growing IT/startup scene', 'Good connectivity to Delhi', 'Strong handicrafts/arts'],
    cons: ['Very hot summers', 'Water scarcity', 'Limited big-corp job market', 'Dusty environment'],
    weatherSummary: 'Very hot summers (45°C), pleasant winters, low rainfall',
    languages: ['Hindi', 'Rajasthani', 'English'],
    popularAreas: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Jagatpura'],
    expenses: {
      rent1bhk: 9000, rent2bhk: 16000, rent3bhk: 27000,
      groceries: 9000, diningOut: 6500, transport: 6500,
      utilities: 3500, schoolCbse: 5500, schoolIntl: 18000,
      healthcare: 4500, housekeeping: 6000, entertainment: 3500,
    },
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab/Haryana',
    tier: 'Tier 2',
    region: 'North',
    description: 'India\'s best-planned city. High standard of living, clean, excellent connectivity, large NRI (Punjabi) community.',
    pros: ['Best-planned city in India', 'Very clean & green', 'Large NRI/Punjabi community', 'Close to hills & Delhi', 'Good schools'],
    cons: ['Limited job market (government/PSU heavy)', 'Expensive for tier-2', 'Conservative social culture', 'Extreme weather'],
    weatherSummary: 'Very cold winters, very hot summers, pleasant spring & autumn',
    languages: ['Punjabi', 'Hindi', 'English'],
    popularAreas: ['Sector 17', 'Sector 7', 'Mohali', 'Panchkula', 'Zirakpur'],
    expenses: {
      rent1bhk: 13000, rent2bhk: 23000, rent3bhk: 40000,
      groceries: 11000, diningOut: 8000, transport: 7000,
      utilities: 4000, schoolCbse: 6500, schoolIntl: 20000,
      healthcare: 5000, housekeeping: 7000, entertainment: 5000,
    },
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    tier: 'Tier 2',
    region: 'South',
    description: 'Manchester of South India. Manufacturing hub with pleasant climate at 411m altitude. Affordable.',
    pros: ['Pleasant climate', 'Very affordable', 'Strong industrial job market', 'Good hospitals', 'Green & clean'],
    cons: ['Limited nightlife', 'Language barrier (Tamil dominant)', 'Limited entertainment', 'Smaller NRI community'],
    weatherSummary: 'Pleasant year-round due to elevation, moderate NE monsoon',
    languages: ['Tamil', 'English', 'Kannada'],
    popularAreas: ['RS Puram', 'Peelamedu', 'Saibaba Colony', 'Ganapathy', 'Sowripalayam'],
    expenses: {
      rent1bhk: 8000, rent2bhk: 14000, rent3bhk: 24000,
      groceries: 9000, diningOut: 5500, transport: 6000,
      utilities: 3500, schoolCbse: 5500, schoolIntl: 16000,
      healthcare: 4500, housekeeping: 5500, entertainment: 3000,
    },
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    tier: 'Tier 2',
    region: 'Central',
    description: 'Geographic center of India. Zero City for government projects. Affordable with growing infrastructure.',
    pros: ['Very affordable', 'Geographic center (connectivity)', 'Clean air', 'Government investment hub', 'Good oranges!'],
    cons: ['Very hot summers', 'Limited private job market', 'Smaller expat community', 'Limited entertainment'],
    weatherSummary: 'Very hot summers (48°C), pleasant Oct–Feb, monsoon Jun–Sep',
    languages: ['Hindi', 'Marathi', 'English'],
    popularAreas: ['Dharampeth', 'Pratap Nagar', 'Bajaj Nagar', 'Wardha Road', 'Hingna'],
    expenses: {
      rent1bhk: 8000, rent2bhk: 14000, rent3bhk: 24000,
      groceries: 8500, diningOut: 5500, transport: 6000,
      utilities: 3500, schoolCbse: 5000, schoolIntl: 14000,
      healthcare: 4500, housekeeping: 5500, entertainment: 3000,
    },
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    tier: 'Tier 2',
    region: 'North',
    description: 'City of Nawabs. Rapidly modernizing with good infrastructure investment. Rich culture, affordable.',
    pros: ['Rich cultural heritage', 'Affordable', 'Growing infrastructure', 'Good CBSE schools', 'UP govt investment'],
    cons: ['Hot & dusty summers', 'Traffic', 'Limited private sector jobs', 'Occasional political tension'],
    weatherSummary: 'Very hot summers, foggy winters, monsoon Jul–Sep',
    languages: ['Hindi', 'Urdu', 'English'],
    popularAreas: ['Gomti Nagar', 'Hazratganj', 'Vibhuti Khand', 'Alambagh', 'Aliganj'],
    expenses: {
      rent1bhk: 8000, rent2bhk: 14000, rent3bhk: 24000,
      groceries: 8500, diningOut: 6000, transport: 6000,
      utilities: 3500, schoolCbse: 5500, schoolIntl: 15000,
      healthcare: 4500, housekeeping: 5500, entertainment: 3500,
    },
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    tier: 'Tier 2',
    region: 'Central',
    description: 'India\'s cleanest city for 7 consecutive years. Excellent food scene, growing IT presence.',
    pros: ['Cleanest city in India', 'Amazing street food', 'Affordable', 'Growing IT sector', 'Good connectivity'],
    cons: ['Very hot summers', 'Limited corporate jobs', 'Traffic', 'Limited international schools'],
    weatherSummary: 'Very hot summers, pleasant Oct–Mar, moderate monsoon',
    languages: ['Hindi', 'Malwi', 'English'],
    popularAreas: ['Vijay Nagar', 'Palasia', 'AB Road', 'Super Corridor', 'Scheme 54'],
    expenses: {
      rent1bhk: 8000, rent2bhk: 14000, rent3bhk: 23000,
      groceries: 8000, diningOut: 5500, transport: 6000,
      utilities: 3500, schoolCbse: 5000, schoolIntl: 13000,
      healthcare: 4000, housekeeping: 5000, entertainment: 3000,
    },
  },
  {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram',
    state: 'Kerala',
    tier: 'Tier 2',
    region: 'South',
    description: 'Kerala\'s capital. Government and IT hub. Clean, educated population, good quality of life. Strong NRI base.',
    pros: ['Coastal lifestyle', 'Large NRI community', 'Excellent literacy & safety', 'Good healthcare', 'IT hub'],
    cons: ['Heavy monsoon', 'Conservative culture', 'Limited large-corp jobs', 'High cost for tier-2'],
    weatherSummary: 'Hot & humid, two monsoons, pleasant Nov–Feb',
    languages: ['Malayalam', 'English', 'Tamil'],
    popularAreas: ['Technopark area', 'Kowdiar', 'Vazhuthacaud', 'Pattom', 'Vattiyoorkavu'],
    expenses: {
      rent1bhk: 11000, rent2bhk: 20000, rent3bhk: 34000,
      groceries: 11000, diningOut: 7500, transport: 6500,
      utilities: 4000, schoolCbse: 6000, schoolIntl: 20000,
      healthcare: 5500, housekeeping: 7000, entertainment: 4500,
    },
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    tier: 'Tier 2',
    region: 'West',
    description: 'Cultural capital of Gujarat. Defence corridor hub, growing industry. Pleasant and affordable.',
    pros: ['Very affordable', 'Defence sector jobs', 'Cultural richness (MSU)', 'Good connectivity', 'Safe city'],
    cons: ['Very hot summers', 'Limited tech jobs', 'Dry city', 'Smaller expat community'],
    weatherSummary: 'Very hot summers, pleasant winters, monsoon Jun–Sep',
    languages: ['Gujarati', 'Hindi', 'English'],
    popularAreas: ['Alkapuri', 'Gotri', 'Waghodia Road', 'Manjalpur', 'Fatehgunj'],
    expenses: {
      rent1bhk: 9000, rent2bhk: 16000, rent3bhk: 27000,
      groceries: 9000, diningOut: 6000, transport: 6000,
      utilities: 3500, schoolCbse: 5500, schoolIntl: 16000,
      healthcare: 4500, housekeeping: 6000, entertainment: 3500,
    },
  },
  // ── TIER 3 ────────────────────────────────────────────────────────────────
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    tier: 'Tier 3',
    region: 'South',
    description: 'City of Palaces. Cleanest, most liveable small city. Booming with Bengaluru overspill. Great retirement destination.',
    pros: ['Very clean & green', 'Close to Bengaluru (3hr)', 'Pleasant climate', 'Affordable', 'Cultural heritage'],
    cons: ['Limited job market', 'Small city limitations', 'Growing traffic', 'Limited nightlife'],
    weatherSummary: 'Pleasant year-round, moderate monsoon Jun–Sep',
    languages: ['Kannada', 'English', 'Tamil'],
    popularAreas: ['Vijayanagar', 'Kuvempunagar', 'JSS Road', 'Bogadi', 'Hebbal'],
    expenses: {
      rent1bhk: 7000, rent2bhk: 12000, rent3bhk: 20000,
      groceries: 8000, diningOut: 5000, transport: 5500,
      utilities: 3000, schoolCbse: 4500, schoolIntl: 12000,
      healthcare: 4000, housekeeping: 5000, entertainment: 2500,
    },
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    tier: 'Tier 3',
    region: 'West',
    description: 'India\'s beach paradise. Popular with digital nomads, expats, and retirees. High quality of life, but seasonal.',
    pros: ['Beach lifestyle', 'International community', 'Good hospitals', 'Pleasant winters', 'Work-from-anywhere culture'],
    cons: ['Very expensive for tier-3', 'Seasonal economy', 'Limited corporate jobs', 'Very heavy monsoon May–Sep'],
    weatherSummary: 'Perfect Oct–Mar, very heavy monsoon Jun–Sep, hot pre-monsoon',
    languages: ['Konkani', 'English', 'Hindi', 'Marathi'],
    popularAreas: ['Panaji', 'Calangute', 'Candolim', 'Margao', 'Vasco'],
    expenses: {
      rent1bhk: 18000, rent2bhk: 32000, rent3bhk: 55000,
      groceries: 13000, diningOut: 11000, transport: 8000,
      utilities: 5000, schoolCbse: 6500, schoolIntl: 20000,
      healthcare: 6000, housekeeping: 8000, entertainment: 9000,
    },
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    tier: 'Tier 3',
    region: 'North',
    description: 'Gateway to Uttarakhand. Clean hill city with pleasant year-round climate. Close to Delhi, good schools.',
    pros: ['Pleasant climate', 'Clean air', 'Good boarding/CBSE schools', '5hr from Delhi', 'Hill town quality of life'],
    cons: ['Limited job market', 'Traffic congestion', 'Growing too fast', 'Limited entertainment'],
    weatherSummary: 'Pleasant year-round (cooler than plains), monsoon Jul–Sep',
    languages: ['Hindi', 'Garhwali', 'English'],
    popularAreas: ['Rajpur Road', 'Clement Town', 'Vasant Vihar', 'GMS Road', 'Sahastradhara Road'],
    expenses: {
      rent1bhk: 9000, rent2bhk: 16000, rent3bhk: 27000,
      groceries: 9000, diningOut: 6000, transport: 6500,
      utilities: 3500, schoolCbse: 5500, schoolIntl: 15000,
      healthcare: 4500, housekeeping: 5500, entertainment: 3500,
    },
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    tier: 'Tier 3',
    region: 'Central',
    description: 'City of Lakes. Clean, green, and very affordable. Growing defence and government hub.',
    pros: ['Very affordable', 'Lakes & green spaces', 'Clean for a city', 'Defence hub investment', 'Friendly community'],
    cons: ['Limited private sector jobs', 'Very hot summers', 'Limited entertainment', 'Smaller NRI community'],
    weatherSummary: 'Very hot summers, pleasant Oct–Mar, moderate monsoon',
    languages: ['Hindi', 'English'],
    popularAreas: ['MP Nagar', 'Kolar Road', 'Arera Colony', 'Trilanga', 'Hoshangabad Road'],
    expenses: {
      rent1bhk: 7000, rent2bhk: 12000, rent3bhk: 20000,
      groceries: 7500, diningOut: 5000, transport: 5500,
      utilities: 3000, schoolCbse: 4500, schoolIntl: 11000,
      healthcare: 4000, housekeeping: 4500, entertainment: 2500,
    },
  },
  {
    id: 'pondicherry',
    name: 'Puducherry',
    state: 'Puducherry',
    tier: 'Tier 3',
    region: 'South',
    description: 'Franco-Tamil coastal town. Unique French heritage, slower pace, popular with retirees and remote workers.',
    pros: ['Unique French heritage', 'Beach lifestyle', 'Very relaxed pace', 'Lower tax (UT status)', 'Spiritual/Auroville community'],
    cons: ['Very limited jobs', 'Small city', 'Hot & humid', 'Limited medical specialists'],
    weatherSummary: 'Hot & humid year-round, cyclone risk Nov–Dec',
    languages: ['Tamil', 'French', 'English'],
    popularAreas: ['White Town', 'Lawspet', 'Ariyankuppam', 'Mudaliarpet', 'Villianur'],
    expenses: {
      rent1bhk: 8000, rent2bhk: 14000, rent3bhk: 23000,
      groceries: 9000, diningOut: 6500, transport: 5500,
      utilities: 3500, schoolCbse: 5000, schoolIntl: 13000,
      healthcare: 4500, housekeeping: 5500, entertainment: 4000,
    },
  },
]

export const CITY_TIERS: CityTier[] = ['Metro', 'Tier 2', 'Tier 3']
export const REGIONS = ['All', 'North', 'South', 'West', 'Central'] as const
export type Region = typeof REGIONS[number]

export function totalMonthlyExpense(expenses: ExpenseProfile, bhkSize: 1 | 2 | 3, hasKids: boolean, intlSchool: boolean): number {
  const rent = bhkSize === 1 ? expenses.rent1bhk : bhkSize === 2 ? expenses.rent2bhk : expenses.rent3bhk
  const school = hasKids ? (intlSchool ? expenses.schoolIntl : expenses.schoolCbse) : 0
  return rent + expenses.groceries + expenses.diningOut + expenses.transport +
    expenses.utilities + school + expenses.healthcare + expenses.housekeeping + expenses.entertainment
}
