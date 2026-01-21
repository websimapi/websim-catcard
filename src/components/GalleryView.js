import React, { useEffect, useState } from 'react';
import { getCards, subscribeToCards, deleteCard } from '../utils/storage.js';
import { Card } from './Card.js';

export function GalleryView() {
    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        getCards().then(data => {
            setCards(data);
            setLoading(false);
        });

        // Subscription for real-time updates
        const sub = subscribeToCards((data) => {
            setCards(data);
        });

        return () => {}; // Cleanup not strictly needed for websim usually, but good practice
    }, []);

    const handleDelete = async (id) => {
        setLoading(true);
        await deleteCard(id);
        setSelectedCard(null); // Close modal if open
        setLoading(false);
    };

    const filteredCards = cards.filter(card => {
        const search = filter.toLowerCase();
        return (
            card.name.toLowerCase().includes(search) || 
            card.breed.toLowerCase().includes(search) ||
            card.description.toLowerCase().includes(search)
        );
    });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-charcoal">My Collection ({cards.length})</h2>
                
                <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search kitties..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral bg-white"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {loading && cards.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
                </div>
            ) : filteredCards.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="text-6xl mb-4">😿</div>
                    <p className="text-xl text-gray-500">No cats found.</p>
                    {cards.length === 0 && <p className="text-coral mt-2">Go create some!</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCards.map(card => (
                        <Card 
                            key={card.id} 
                            data={card} 
                            onClick={() => setSelectedCard(card)} 
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedCard && (
                <Card 
                    data={selectedCard} 
                    expanded={true} 
                    onClick={() => setSelectedCard(null)} 
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}