window.GalleryView = function() {
    const { useEffect, useState } = window.React;
    const { getCards, subscribeToCards, deleteCard } = window.Storage;
    const Card = window.Card;

    const [cards, setCards] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        let unsubscribe;
        const init = async () => {
            const initialData = await getCards();
            setCards(initialData);
            unsubscribe = await subscribeToCards(setCards);
        };
        init();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    const handleDelete = async (id) => {
        await deleteCard(id);
        setSelectedCard(null);
    };

    const filteredCards = cards.filter(card => {
        const search = filter.toLowerCase();
        return (
            card.name.toLowerCase().includes(search) || 
            card.breed.toLowerCase().includes(search) ||
            card.description.toLowerCase().includes(search)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredCards.length / ITEMS_PER_PAGE));
    // Ensure page is valid
    if (page >= totalPages && page > 0) setPage(totalPages - 1);

    const displayedCards = filteredCards.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4 shrink-0 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-charcoal">Collection ({cards.length})</h2>
                <div className="relative w-40 md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setPage(0); }}
                        className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-200 focus:outline-none focus:border-coral bg-white text-sm"
                    />
                    <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
                </div>
            </div>

            {/* Grid Area - No visible scrollbar, handled by pagination */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min content-start">
                {displayedCards.map(card => (
                    <Card 
                        key={card.id} 
                        data={card} 
                        onClick={() => setSelectedCard(card)} 
                    />
                ))}
                {displayedCards.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-10">
                        <div className="text-4xl mb-2">😿</div>
                        <p>No cats found.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredCards.length > 0 && (
                <div className="mt-4 shrink-0 flex items-center justify-center gap-4 py-2 bg-white/50 rounded-full backdrop-blur-sm mx-auto shadow-sm px-6">
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-coral hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal transition-colors font-bold"
                    >
                        ←
                    </button>
                    <span className="text-sm font-semibold text-charcoal w-20 text-center">
                        {page + 1} / {totalPages}
                    </span>
                    <button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-coral hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-charcoal transition-colors font-bold"
                    >
                        →
                    </button>
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