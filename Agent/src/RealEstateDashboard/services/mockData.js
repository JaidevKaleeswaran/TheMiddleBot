export const mockClients = [
    { id: 1, name: 'Johini Eirana', phone: '+1 555-0123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johini', importanceScore: 92, tier: 'Critical' },
    { id: 2, name: 'Barara Fuders', phone: '+1 555-0124', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Barara', importanceScore: 78, tier: 'High' },
    { id: 3, name: 'Amiator Smith', phone: '+1 555-0125', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amiator', importanceScore: 65, tier: 'Normal' },
    { id: 4, name: 'Henny Darman', phone: '+1 555-0126', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henny', importanceScore: 88, tier: 'Critical' },
    { id: 5, name: 'Alex Johnson', phone: '+1 555-0127', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', importanceScore: 45, tier: 'Low' },
    { id: 6, name: 'Sarah Miller', phone: '+1 555-0128', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', importanceScore: 95, tier: 'Critical' },
];

export const mockProperties = [
    { id: 1, address: '236 Hountniy Rd', price: 485000, type: 'House', typeColor: 'bg-blue-500', sellBy: '3h 30s', bidCount: 12, maxBid: 485000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 2, address: '2343 Sumnon Rd', price: 485000, type: 'House', typeColor: 'bg-blue-500', sellBy: '2h 30s', bidCount: 8, maxBid: 485000, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 3, address: '795 Testloy Rd', price: 800000, type: 'Condo', typeColor: 'bg-brand-500', sellBy: '2h 30s', bidCount: 22, maxBid: 800000, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { id: 4, address: '3085 Caemon Rd', price: 350000, type: 'Apt', typeColor: 'bg-teal-500', sellBy: '2h 30s', bidCount: 4, maxBid: 345000, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
];

export const mockBids = [
    { id: 1, bidderName: 'Offer 1', property: '236 Hountniy Rd', amount: 485000, willOfferMore: true, isHighest: true, date: '12 mins ago' },
    { id: 2, bidderName: 'Offer 2', property: '236 Hountniy Rd', amount: 475000, willOfferMore: false, isHighest: false, date: '1 hour ago' },
    { id: 3, bidderName: 'Offer 3', property: '795 Testloy Rd', amount: 800000, willOfferMore: true, isHighest: true, date: '3 hours ago' },
    { id: 4, bidderName: 'Offer 4', property: '2343 Sumnon Rd', amount: 485000, willOfferMore: false, isHighest: true, date: '5 hours ago' },
];

export const mockChartData = [
    { name: 'MON', value: 40 },
    { name: 'TUE', value: 30 },
    { name: 'WED', value: 20 },
    { name: 'THU', value: 90 },
    { name: 'FRI', value: 65 },
    { name: 'SAT', value: 50 },
    { name: 'SUN', value: 80 },
];

export const mockNotes = [
    { id: 1, client: 'Johini Eirana', isAI: true, text: 'Unannounced note flash cards. Client is very interested in school districts.', date: 'Just now' },
    { id: 2, client: 'Barara Fuders', isAI: false, text: 'What’s compensation for closing process?', date: '1 hr ago' },
    { id: 3, client: 'Amiator Smith', isAI: true, text: 'The latest client callback notes indicate high urgency to move.', date: '3 hrs ago' },
    { id: 4, client: 'Henny Darman', isAI: false, text: 'Provide a recent tax trace documentation to client.', date: '5 hrs ago' },
];

export const mockFlashcards = [
    { id: 1, front: "What is Johini's max budget?", back: "$500,000 with pre-approval." },
    { id: 2, front: "Why is Barara moving?", back: "Job relocation to the downtown area." },
    { id: 3, front: "What are Amiator's deal breakers?", back: "Needs at least 3 bedrooms and a yard." },
];

export const mockDeadlines = [
    { id: 1, date: 'Today', type: 'Sell By', text: '236 Hountniy Rd offering window closes', urgency: 'danger' },
    { id: 2, date: 'Tomorrow', type: 'Callback', text: 'Follow up with Sarah Miller', urgency: 'warning' },
    { id: 3, date: 'Wed', type: 'Meeting', text: 'Closing for 102 Main St', urgency: 'success' },
];

export const mockDealProbabilities = [
    { property: '236 Hountniy Rd', client: 'Johini Eirana', probability: 92, trend: 'up', factors: ['Strong pre-approval', 'Highest bid', 'Highly engaged'] },
    { property: '795 Testloy Rd', client: 'Amiator Smith', probability: 64, trend: 'down', factors: ['Lost bidding war', 'Market cooling'] },
    { property: '3085 Caemon Rd', client: 'Alex Johnson', probability: 35, trend: 'down', factors: ['Budget mismatch', 'Low responsiveness'] },
];

export const kpiData = {
    activeClients: { value: 128, trend: '-10%' },
    totalListings: { value: 34, trend: '+34%' },
    highestBid: { value: '$485K', trend: '+30%' },
    avgScore: { value: 72.4, trend: '+72.4%' },
};
