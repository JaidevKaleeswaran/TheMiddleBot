// Enable mutable exports for session updates
export let mockClients = [
    { id: 1, name: 'Johini Eirana', phone: '+15105571410', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johini', importanceScore: 92, tier: 'Critical' },
    { id: 2, name: 'Barara Fuders', phone: '+16284453201', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Barara', importanceScore: 78, tier: 'High' },
    { id: 3, name: 'Amiator Smith', phone: '+15102987634', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amiator', importanceScore: 65, tier: 'Normal' },
    { id: 4, name: 'Henny Darman', phone: '+19256174082', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henny', importanceScore: 88, tier: 'Critical' },
    { id: 5, name: 'Alex Johnson', phone: '+14085539210', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', importanceScore: 45, tier: 'Low' },
    { id: 6, name: 'Sarah Miller', phone: '+16503718456', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', importanceScore: 95, tier: 'Critical' },
    { id: 7, name: 'Kushal M.', phone: '+15105571410', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kushal', importanceScore: 72, tier: 'High' },
];

export let mockNotes = [
    { id: 1, clientId: 1, client: 'Johini Eirana', isAI: true, text: 'Unannounced note flash cards. Client is very interested in school districts.', date: 'Just now' },
    { id: 2, clientId: 2, client: 'Barara Fuders', isAI: false, text: 'What\u2019s compensation for closing process?', date: '1 hr ago' },
    { id: 3, clientId: 3, client: 'Amiator Smith', isAI: true, text: 'The latest client callback notes indicate high urgency to move.', date: '3 hrs ago' },
    { id: 4, clientId: 4, client: 'Henny Darman', isAI: false, text: 'Provide a recent tax trace documentation to client.', date: '5 hrs ago' },
    { id: 5, clientId: 5, client: 'Alex Johnson', isAI: true, text: 'AI detected low engagement. Suggest sending a market update.', date: '8 hrs ago' },
    { id: 6, clientId: 6, client: 'Sarah Miller', isAI: true, text: 'Client requested cash offer comparison for current home.', date: '10 hrs ago' },
    { id: 7, clientId: 7, client: 'Kushal M.', isAI: false, text: 'Interested in 2-bedroom condos near downtown. Budget around $750K.', date: '12 hrs ago' },
];

// Helper to update client intelligence from the AI Pipeline
export const updateClientAIResult = (clientId, analysis, summary) => {
    const clientIndex = mockClients.findIndex(c => c.id === clientId * 1 || c.id === clientId);
    if (clientIndex !== -1) {
        mockClients[clientIndex] = {
            ...mockClients[clientIndex],
            importanceScore: analysis.importanceScore,
            tier: analysis.tier
        };
    }

    const newNote = {
        id: Date.now(),
        clientId,
        client: mockClients[clientIndex]?.name || 'Unknown',
        isAI: true,
        text: summary,
        date: 'Just now'
    };
    mockNotes = [newNote, ...mockNotes];
    return true;
};

export let mockProperties = [
    { id: 1, address: '236 Hountniy Rd', price: 485000, type: 'House', typeColor: 'bg-blue-500', sellBy: '3h 30s', bidCount: 12, maxBid: 485000, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', beds: 4, baths: 3, sqft: 2400 },
    { id: 2, address: '2343 Sumnon Rd', price: 485000, type: 'House', typeColor: 'bg-blue-500', sellBy: '2h 30s', bidCount: 8, maxBid: 485000, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', beds: 3, baths: 2, sqft: 1800 },
    { id: 3, address: '795 Testloy Rd', price: 800000, type: 'Condo', typeColor: 'bg-brand-500', sellBy: '12h 15m', bidCount: 22, maxBid: 800000, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', beds: 2, baths: 2, sqft: 1200 },
    { id: 4, address: '3085 Caemon Rd', price: 350000, type: 'Apt', typeColor: 'bg-teal-500', sellBy: '1d 4h', bidCount: 4, maxBid: 345000, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', beds: 1, baths: 1, sqft: 850 },
];

export const mockBids = [
    { id: 1, bidderName: 'Johini Eirana', clientId: 1, property: '236 Hountniy Rd', amount: 485000, willOfferMore: true, isHighest: true, date: '12 mins ago' },
    { id: 2, bidderName: 'Barara Fuders', clientId: 2, property: '236 Hountniy Rd', amount: 475000, willOfferMore: false, isHighest: false, date: '1 hour ago' },
    { id: 3, bidderName: 'Amiator Smith', clientId: 3, property: '795 Testloy Rd', amount: 800000, willOfferMore: true, isHighest: true, date: '3 hours ago' },
    { id: 4, bidderName: 'Henny Darman', clientId: 4, property: '2343 Sumnon Rd', amount: 485000, willOfferMore: false, isHighest: true, date: '5 hours ago' },
    { id: 5, bidderName: 'Alex Johnson', clientId: 5, property: '3085 Caemon Rd', amount: 345000, willOfferMore: true, isHighest: true, date: '8 hours ago' },
    { id: 6, bidderName: 'Sarah Miller', clientId: 6, property: '236 Hountniy Rd', amount: 460000, willOfferMore: false, isHighest: false, date: '10 hours ago' },
    { id: 7, bidderName: 'Kushal M.', clientId: 7, property: '795 Testloy Rd', amount: 780000, willOfferMore: true, isHighest: false, date: '14 hours ago' },
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

export const mockFlashcards = [
    { id: 1, front: "What is Johini's max budget?", back: "$500,000 with pre-approval." },
    { id: 2, front: "Why is Barara moving?", back: "Job relocation to the downtown area." },
    { id: 3, front: "What are Amiator's deal breakers?", back: "Needs at least 3 bedrooms and a yard." },
];

export const mockDeadlines = [
    { id: 1, date: 'Today', type: 'Sell By', text: '236 Hountniy Rd offering window closes', urgency: 'danger', clientId: 1 },
    { id: 2, date: 'Today', type: 'Meeting', text: 'Review contract terms with Barara Fuders', urgency: 'warning', clientId: 2 },
    { id: 3, date: 'Tomorrow', type: 'Callback', text: 'Follow up with Sarah Miller', urgency: 'warning', clientId: 6 },
    { id: 4, date: 'Wed', type: 'Meeting', text: 'Closing for 102 Main St', urgency: 'success', clientId: 3 },
    { id: 5, date: 'Thu', type: 'Callback', text: 'Ask Henny Darman for tax records', urgency: 'success', clientId: 4 },
    { id: 6, date: 'Fri', type: 'Callback', text: 'Prequalification update for Alex Johnson', urgency: 'warning', clientId: 5 },
    { id: 7, date: 'Sat', type: 'Meeting', text: 'Property tour with Kushal M.', urgency: 'success', clientId: 7 },
];

export const mockDealProbabilities = [
    { property: '236 Hountniy Rd', client: 'Johini Eirana', clientId: 1, probability: 92, trend: 'up', factors: ['Strong pre-approval', 'Highest bid', 'Highly engaged'] },
    { property: '236 Hountniy Rd', client: 'Sarah Miller', clientId: 6, probability: 85, trend: 'up', factors: ['Cash offer ready', 'Quick closing'] },
    { property: '2343 Sumnon Rd', client: 'Henny Darman', clientId: 4, probability: 78, trend: 'up', factors: ['Local relocation', 'Price match'] },
    { property: '795 Testloy Rd', client: 'Kushal M.', clientId: 7, probability: 70, trend: 'up', factors: ['Motivated buyer', 'Pre-approved'] },
    { property: '795 Testloy Rd', client: 'Amiator Smith', clientId: 3, probability: 64, trend: 'down', factors: ['Lost bidding war', 'Market cooling'] },
    { property: '236 Hountniy Rd', client: 'Barara Fuders', clientId: 2, probability: 55, trend: 'stable', factors: ['Contingent offer', 'Financing delay'] },
    { property: '3085 Caemon Rd', client: 'Alex Johnson', clientId: 5, probability: 35, trend: 'down', factors: ['Budget mismatch', 'Low responsiveness'] },
];

export const kpiData = {
    activeClients: { value: 7, trend: '+17%' },
    totalListings: { value: 4, trend: '+34%' },
    highestBid: { value: '$800K', trend: '+30%' },
    avgScore: { value: 76.4, trend: '+12%' },
};

// Mock messages for messaging modal (keyed by clientId)
export let mockMessages = {
    1: [
        { sender: 'client', text: 'Hi David, I just wanted to check on the status of my offer for 236 Hountniy Rd.', timestamp: '2:15 PM' },
        { sender: 'agent', text: 'Hey Johini! Great news \u2014 your bid is currently the highest. The seller is reviewing offers by end of day today.', timestamp: '2:18 PM' },
        { sender: 'client', text: 'Amazing! Should I prepare anything for the inspection?', timestamp: '2:22 PM' },
        { sender: 'agent', text: 'Yes, I\u2019ll send you a checklist shortly. Also, make sure your pre-approval letter is updated.', timestamp: '2:25 PM' },
    ],
    2: [
        { sender: 'agent', text: 'Hi Barara, just following up on the contract terms we discussed yesterday.', timestamp: '10:00 AM' },
        { sender: 'client', text: 'Thanks David. I had a question about the closing costs breakdown.', timestamp: '10:15 AM' },
        { sender: 'agent', text: 'Sure, I\u2019ll pull together a detailed comparison sheet for you today.', timestamp: '10:20 AM' },
    ],
    3: [
        { sender: 'client', text: 'Hey, I need at least 3 bedrooms and a yard. Is there anything new?', timestamp: '9:00 AM' },
        { sender: 'agent', text: 'I have two new listings that match your criteria. I\u2019ll send them over shortly.', timestamp: '9:05 AM' },
    ],
    4: [
        { sender: 'agent', text: 'Henny, could you send over the tax records we discussed?', timestamp: '11:30 AM' },
        { sender: 'client', text: 'I\u2019ll have them to you by Thursday.', timestamp: '11:45 AM' },
    ],
    5: [
        { sender: 'agent', text: 'Hi Alex, just checking in. Have you had a chance to review the properties I sent?', timestamp: '3:00 PM' },
        { sender: 'client', text: 'Not yet, been busy this week. I\u2019ll look over the weekend.', timestamp: '5:30 PM' },
    ],
    6: [
        { sender: 'client', text: 'David, I want to make a cash offer. Can we talk about strategy?', timestamp: '1:00 PM' },
        { sender: 'agent', text: 'Absolutely Sarah! Cash offers are very competitive right now. Let\u2019s set up a call for tomorrow.', timestamp: '1:10 PM' },
        { sender: 'client', text: 'Perfect. I\u2019m free after 2 PM.', timestamp: '1:12 PM' },
    ],
    7: [
        { sender: 'client', text: 'Hi, I\u2019m interested in condos near downtown. Budget is around $750K.', timestamp: '8:00 AM' },
        { sender: 'agent', text: 'Welcome Kushal! I have a great condo at 795 Testloy Rd that might be perfect. Want to schedule a tour?', timestamp: '8:15 AM' },
        { sender: 'client', text: 'Yes please! This Saturday works for me.', timestamp: '8:20 AM' },
        { sender: 'agent', text: 'Done \u2014 I\u2019ve booked you for Saturday at 10 AM. I\u2019ll send the details.', timestamp: '8:25 AM' },
    ],
};
