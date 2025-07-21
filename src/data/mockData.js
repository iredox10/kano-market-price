
// src/data/mockData.js

// --- Helper Functions & Analytics Data ---

// Helper function to generate price history
const generatePriceHistory = (basePrice) => {
  const history = { daily: [], weekly: [], monthly: [] };
  let currentDate = new Date();

  // Daily (last 24 hours)
  for (let i = 23; i >= 0; i--) {
    let date = new Date();
    date.setHours(currentDate.getHours() - i);
    history.daily.push({
      date: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      ownerPrice: parseFloat((basePrice + (Math.random() - 0.5) * 1000).toFixed(2)),
      communityPrice: parseFloat((basePrice + (Math.random() - 0.5) * 1500).toFixed(2)),
    });
  }

  // Weekly (last 7 days)
  for (let i = 6; i >= 0; i--) {
    let date = new Date();
    date.setDate(currentDate.getDate() - i);
    history.weekly.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      ownerPrice: parseFloat((basePrice + (Math.random() - 0.3) * 4000).toFixed(2)),
      communityPrice: parseFloat((basePrice + (Math.random() - 0.4) * 5000).toFixed(2)),
    });
  }

  // Monthly (last 6 months)
  for (let i = 5; i >= 0; i--) {
    let date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    history.monthly.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      ownerPrice: parseFloat((basePrice + (Math.random() - 0.2) * 8000).toFixed(2)),
      communityPrice: parseFloat((basePrice + (Math.random() - 0.1) * 10000).toFixed(2)),
    });
  }

  return history;
};

export const adminAnalyticsData = {
  growth: [
    { date: 'Jul 7', users: 10, shops: 2 },
    { date: 'Jul 8', users: 15, shops: 1 },
    { date: 'Jul 9', users: 12, shops: 3 },
    { date: 'Jul 10', users: 20, shops: 2 },
    { date: 'Jul 11', users: 18, shops: 4 },
    { date: 'Jul 12', users: 25, shops: 3 },
    { date: 'Jul 13', users: 22, shops: 5 },
  ],
  topSearches: [
    { name: 'Rice', count: 1250 },
    { name: 'Vegetable Oil', count: 980 },
    { name: 'Tomatoes', count: 850 },
    { name: 'Onions', count: 760 },
    { name: 'Yam', count: 620 },
  ],
  priceContributions: [
    { name: 'Shop Owners', value: 450, fill: '#16a34a' },
    { name: 'Community', value: 280, fill: '#3b82f6' },
  ],
};

export const allUsers = [
  { id: 101, name: 'Aisha Bello', email: 'aisha.b@example.com', signupDate: '2025-06-20', status: 'Active' },
  { id: 102, name: 'Musa Ibrahim', email: 'musa.i@example.com', signupDate: '2025-06-22', status: 'Active' },
  { id: 103, name: 'Fatima Sani', email: 'fatima.s@example.com', signupDate: '2025-06-25', status: 'Suspended' },
  { id: 104, name: 'Umar Garba', email: 'umar.g@example.com', signupDate: '2025-06-28', status: 'Active' },
  { id: 105, name: 'Zainab Lawal', email: 'zainab.l@example.com', signupDate: '2025-07-01', status: 'Active' },
  { id: 106, name: 'Balarabe Jibril', email: 'balarabe.j@example.com', signupDate: '2025-07-03', status: 'Active' },
  { id: 107, name: 'Hadiza Yusuf', email: 'hadiza.y@example.com', signupDate: '2025-07-05', status: 'Active' },
  { id: 108, name: 'Nafisa Abdullahi', email: 'nafisa.a@example.com', signupDate: '2025-07-08', status: 'Active' },
  { id: 109, name: 'Sadiq Mohammed', email: 'sadiq.m@example.com', signupDate: '2025-07-10', status: 'Suspended' },
  { id: 110, name: 'Rukayya Dauda', email: 'rukayya.d@example.com', signupDate: '2025-07-12', status: 'Active' },
];

export const myAccountData = {
  contributions: [
    { id: 1, productName: 'Rice (50kg Bag)', price: 76000, market: 'Kantin Kwari Market', date: '2025-07-10' },
    { id: 2, productName: 'Vegetable Oil (5L)', price: 12700, market: 'Sabon Gari Market', date: '2025-07-08' },
    { id: 3, productName: 'Onions (Bag)', price: 44500, market: 'Yankaba Market', date: '2025-07-05' },
  ],
  favoriteProductIds: [1, 4, 11] // Corresponds to Rice, Onions, and Yam
};

// --- Core Platform Data ---

export const allMarkets = [
  {
    name: 'Kantin Kwari Market',
    slug: 'Kantin-Kwari-Market',
    description: 'Known as the largest textile market in West Africa, Kantin Kwari also boasts a massive section for fresh foodstuff, grains, and provisions. It\'s a bustling hub of commerce in the heart of Kano.',
    image: 'https://placehold.co/1200x400/2ecc71/fff?text=Kantin+Kwari+Market',
    location: { lat: 11.9903, lng: 8.5167 },
    openingHours: 'Mon - Sat: 8:00 AM - 6:30 PM',
    specialties: ['Textiles', 'Grains', 'Provisions']
  },
  {
    name: 'Sabon Gari Market',
    slug: 'Sabon-Gari-Market',
    description: 'Located in the "new town" area, Sabon Gari market is a vibrant and diverse market known for its wide array of goods, including electronics, clothing, and a rich selection of food items catering to all tastes.',
    image: 'https://placehold.co/1200x400/e74c3c/fff?text=Sabon+Gari+Market',
    location: { lat: 12.0165, lng: 8.5332 },
    openingHours: 'Mon - Sun: 9:00 AM - 7:00 PM',
    specialties: ['Electronics', 'Spices', 'General Goods']
  },
  {
    name: 'Yankaba Market',
    slug: 'Yankaba-Market',
    description: 'Famous for its fresh vegetables, especially perishable items like tomatoes, peppers, and onions. Yankaba is a major distribution point for produce coming into Kano from surrounding farmlands.',
    image: 'https://placehold.co/1200x400/f1c40f/fff?text=Yankaba+Market',
    location: { lat: 12.0333, lng: 8.5667 },
    openingHours: 'Mon - Sat: 7:00 AM - 5:00 PM',
    specialties: ['Tomatoes', 'Peppers', 'Onions', 'Vegetables']
  }
];

export const allShopOwners = [
  {
    id: 1, name: 'Adamu & Sons', specialty: 'Grains & Cereals', logo: 'https://placehold.co/100x100/3498db/fff?text=A', market: 'Kantin Kwari Market', status: 'Verified',
    bio: 'Adamu & Sons has been a trusted name in Kantin Kwari for over 20 years. We specialize in locally sourced grains like rice, millet, and maize, as well as imported cereals. Quality and customer satisfaction are our top priorities.',
    phone: '08012345671', whatsapp: '2348012345671', openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM', socials: { facebook: '#', instagram: '#' }
  },
  {
    id: 2, name: 'Halima\'s Provisions', specialty: 'Cooking Oils & Spices', logo: 'https://placehold.co/100x100/e74c3c/fff?text=H', market: 'Sabon Gari Market', status: 'Verified',
    bio: 'Your one-stop shop for all cooking essentials. From groundnut oil to palm oil, and a wide variety of local and international spices, Halima has it all.',
    phone: '08012345672', whatsapp: '2348012345672', openingHours: 'Mon - Sun: 9:00 AM - 7:00 PM', socials: {}
  },
  {
    id: 3, name: 'Kantin Kwari Veggies', specialty: 'Fresh Vegetables', logo: 'https://placehold.co/100x100/2ecc71/fff?text=K', market: 'Kantin Kwari Market', status: 'Verified',
    bio: 'We provide the freshest vegetables, sourced daily from local farms. From tomatoes and peppers to leafy greens, our quality is unmatched.',
    phone: '08012345673', whatsapp: '2348012345673', openingHours: 'Mon - Sat: 7:00 AM - 5:00 PM', socials: { instagram: '#' }
  },
  {
    id: 4, name: 'Sabo Gida Meats', specialty: 'Fresh & Frozen Meat', logo: 'https://placehold.co/100x100/9b59b6/fff?text=S', market: 'Sabon Gari Market', status: 'Verified',
    bio: 'The best butcher in Sabon Gari market. We offer a wide selection of fresh beef, goat, and chicken, as well as frozen options.',
    phone: '08012345674', whatsapp: '2348012345674', openingHours: 'Mon - Sat: 8:00 AM - 6:30 PM', socials: { facebook: '#' }
  },
  {
    id: 5, name: 'Farm Fresh Produce', specialty: 'Tubers & Vegetables', logo: 'https://placehold.co/100x100/f1c40f/fff?text=F', market: 'Yankaba Market', status: 'Verified',
    bio: 'Specializing in yams, potatoes, and other tubers, as well as a variety of fresh vegetables. We bring the farm directly to you.',
    phone: '08012345675', whatsapp: '2348012345675', openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM', socials: {}
  },
  {
    id: 6, name: 'New Century Grains', specialty: 'Imported Grains', logo: 'https://placehold.co/100x100/f39c12/fff?text=N', market: 'Sabon Gari Market', status: 'Pending',
    bio: 'A new supplier of high-quality imported grains and cereals.', phone: '08012345676', whatsapp: '2348012345676', openingHours: 'Mon - Sat: 9:00 AM - 5:00 PM', socials: {}
  },
  {
    id: 7, name: 'Yankaba Spice Hub', specialty: 'Local and Foreign Spices', logo: 'https://placehold.co/100x100/d35400/fff?text=Y', market: 'Yankaba Market', status: 'Pending',
    bio: 'The best place for all your spice needs. We grind fresh daily.', phone: '08012345677', whatsapp: '2348012345677', openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM', socials: { instagram: '#' }
  }
];

export const allProducts = [
  {
    id: 1, name: 'Rice (50kg Bag)', shop: 'Adamu & Sons', category: 'Grains', image: 'https://placehold.co/400x300/f0f0f0/333?text=Rice',
    description: 'High-quality long-grain parboiled rice, perfect for jollof and other local dishes. Sourced from local farms in Northern Nigeria.',
    currentPrice: { owner: 75000, community: 76500, previousOwnerPrice: 74800 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(75000)
  },
  {
    id: 2, name: 'Vegetable Oil (5L)', shop: 'Halima\'s Provisions', category: 'Oils', image: 'https://placehold.co/400x300/f0f0f0/333?text=Veg+Oil',
    description: 'Cholesterol-free vegetable oil, ideal for frying and everyday cooking. Triple-filtered for purity.',
    currentPrice: { owner: 12500, community: 12800, previousOwnerPrice: 12500 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(12500)
  },
  {
    id: 3, name: 'Tomatoes (Basket)', shop: 'Kantin Kwari Veggies', category: 'Vegetables', image: 'https://placehold.co/400x300/f0f0f0/333?text=Tomatoes',
    description: 'Fresh, ripe tomatoes sourced from farms in the Kano river project. Perfect for stews and salads.',
    currentPrice: { owner: 30000, community: 29500, previousOwnerPrice: 31000 }, stockStatus: 'Low Stock', priceHistory: generatePriceHistory(30000)
  },
  {
    id: 4, name: 'Onions (Bag)', shop: 'Farm Fresh Produce', category: 'Vegetables', image: 'https://placehold.co/400x300/f0f0f0/333?text=Onions',
    description: 'A large bag of fresh, pungent onions. A staple for any Nigerian kitchen.',
    currentPrice: { owner: 45000, community: 44000, previousOwnerPrice: 45500 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(45000)
  },
  {
    id: 9, name: 'Rice (50kg Bag)', shop: 'Halima\'s Provisions', category: 'Grains', image: 'https://placehold.co/400x300/e74c3c/fff?text=Rice',
    description: 'Affordable and clean long-grain parboiled rice.',
    currentPrice: { owner: 74500, community: 75000, previousOwnerPrice: 74500 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(74500)
  },
  {
    id: 10, name: 'Vegetable Oil (5L)', shop: 'Adamu & Sons', category: 'Oils', image: 'https://placehold.co/400x300/3498db/fff?text=Veg+Oil',
    description: 'Pure vegetable oil for all your cooking needs.',
    currentPrice: { owner: 12800, community: 13000, previousOwnerPrice: 12700 }, stockStatus: 'Out of Stock', priceHistory: generatePriceHistory(12800)
  },
  {
    id: 11, name: 'Yam (5 Tubers)', shop: 'Farm Fresh Produce', category: 'Tubers', image: 'https://placehold.co/400x300/f0f0f0/333?text=Yam',
    description: 'Large, healthy yams perfect for pounding or boiling.',
    currentPrice: { owner: 8000, community: 8200, previousOwnerPrice: 8000 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(8000)
  },
  {
    id: 12, name: 'Spaghetti (Carton)', shop: 'Adamu & Sons', category: 'Pasta', image: 'https://placehold.co/400x300/f0f0f0/333?text=Spaghetti',
    description: 'A full carton of quality spaghetti, a family favorite.',
    currentPrice: { owner: 15000, community: 15500, previousOwnerPrice: 14800 }, stockStatus: 'In Stock', priceHistory: generatePriceHistory(15000)
  },
];
