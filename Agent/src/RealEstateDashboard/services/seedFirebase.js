import { db } from '../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { mockClients, mockNotes, mockProperties, mockBids, mockDeadlines, mockDealProbabilities, mockMessages } from './mockData';

/**
 * Seeds all mock data into Firebase Firestore.
 * Call this once to populate your database.
 */
export const seedFirebase = async () => {
    try {
        console.log('🔥 Starting Firebase seed...');

        // 1. Seed Clients
        for (const client of mockClients) {
            await setDoc(doc(db, 'clients', String(client.id)), {
                ...client,
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockClients.length} clients`);

        // 2. Seed Notes
        for (const note of mockNotes) {
            await setDoc(doc(db, 'notes', String(note.id)), {
                ...note,
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockNotes.length} notes`);

        // 3. Seed Properties
        for (const prop of mockProperties) {
            await setDoc(doc(db, 'properties', String(prop.id)), {
                ...prop,
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockProperties.length} properties`);

        // 4. Seed Bids
        for (const bid of mockBids) {
            await setDoc(doc(db, 'bids', String(bid.id)), {
                ...bid,
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockBids.length} bids`);

        // 5. Seed Deadlines
        for (const deadline of mockDeadlines) {
            await setDoc(doc(db, 'deadlines', String(deadline.id)), {
                ...deadline,
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockDeadlines.length} deadlines`);

        // 6. Seed Deal Probabilities
        for (let i = 0; i < mockDealProbabilities.length; i++) {
            await setDoc(doc(db, 'dealProbabilities', String(i + 1)), {
                ...mockDealProbabilities[i],
                createdAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded ${mockDealProbabilities.length} deal probabilities`);

        // 7. Seed Messages (per client)
        for (const [clientId, messages] of Object.entries(mockMessages)) {
            await setDoc(doc(db, 'messages', String(clientId)), {
                clientId: parseInt(clientId),
                messages: messages,
                updatedAt: new Date().toISOString(),
            });
        }
        console.log(`✅ Seeded messages for ${Object.keys(mockMessages).length} clients`);

        console.log('🎉 Firebase seed complete!');
        return { success: true };
    } catch (error) {
        console.error('❌ Firebase seed error:', error);
        return { success: false, error: error.message };
    }
};
