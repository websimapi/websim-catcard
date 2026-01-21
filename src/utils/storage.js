/**
 * Storage Strategy:
 * - Single row per user in 'user_storage_v1' collection.
 * - Row contains 10 generic slots (slot_0 to slot_9) to store JSON data.
 * - slot_0 is reserved for the 'cards' collection.
 */

const COLLECTION_NAME = 'user_storage_v1';
const room = new WebsimSocket();

const INITIAL_DATA = {
    slot_0: [], // Cards array
    slot_1: {}, // Reserved
    slot_2: {}, // Reserved
    slot_3: {}, // Reserved
    slot_4: {}, // Reserved
    slot_5: {}, // Reserved
    slot_6: {}, // Reserved
    slot_7: {}, // Reserved
    slot_8: {}, // Reserved
    slot_9: {}, // Reserved
};

let cachedRecord = null;

async function getUserRecord() {
    if (cachedRecord) return cachedRecord;

    const currentUser = await window.websim.getCurrentUser();
    
    // Attempt to find existing record for this user
    // Since we can only filter by specific fields, and we assume 1 record per user,
    // we just get the list and find the one belonging to the user (filtered implicitly by ownership usually, but explicit here)
    // Actually, getList returns everything, but we can't filter by 'owner' easily in client unless field exists.
    // However, the best way to ensure 1 row per user is to query content created by me.
    
    // Note: WebsimSocket permissions prevent editing others' data, but reading might be open.
    // We will filter client-side if needed, but optimally we rely on the fact that we only create one.
    
    let records = await room.collection(COLLECTION_NAME).getList();
    let userRecord = records.find(r => r.username === currentUser.username);

    if (!userRecord) {
        // Create new record if none exists
        userRecord = await room.collection(COLLECTION_NAME).create(INITIAL_DATA);
    }

    cachedRecord = userRecord;
    return userRecord;
}

export async function getCards() {
    const record = await getUserRecord();
    // Refresh data to ensure latest
    // In a real app we might subscribe, but for now specific getters are fine
    // Or we can re-fetch
    const freshRecord = await room.collection(COLLECTION_NAME).getOne(record.id); // Assuming getOne or just filter
    // Actually getList is safer to refresh
    const records = await room.collection(COLLECTION_NAME).filter({id: record.id}).getList();
    if (records.length > 0) {
        cachedRecord = records[0];
        return cachedRecord.slot_0 || [];
    }
    return [];
}

export async function saveCard(cardData) {
    const record = await getUserRecord();
    
    // Ensure card has ID and timestamp
    const newCard = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...cardData
    };

    const currentCards = record.slot_0 || [];
    const updatedCards = [newCard, ...currentCards]; // Prepend new card

    await room.collection(COLLECTION_NAME).update(record.id, {
        slot_0: updatedCards
    });
    
    // Update cache
    cachedRecord.slot_0 = updatedCards;
    
    return newCard;
}

export async function deleteCard(cardId) {
    const record = await getUserRecord();
    const currentCards = record.slot_0 || [];
    const updatedCards = currentCards.filter(c => c.id !== cardId);

    await room.collection(COLLECTION_NAME).update(record.id, {
        slot_0: updatedCards
    });

    cachedRecord.slot_0 = updatedCards;
    return true;
}

export async function subscribeToCards(callback) {
    // Basic subscription to the collection
    // We need to filter for our specific record logic
    const currentUser = await window.websim.getCurrentUser();
    
    return room.collection(COLLECTION_NAME).subscribe((records) => {
        const myRecord = records.find(r => r.username === currentUser.username);
        if (myRecord) {
            cachedRecord = myRecord;
            callback(myRecord.slot_0 || []);
        }
    });
}