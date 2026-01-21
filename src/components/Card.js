window.Card = function({ data, expanded = false, onClick, onDelete }) {
    const React = window.React;
    const { name, breed, description, imageUrl, created_at } = data;
    
    const dateStr = new Date(created_at).toLocaleDateString();

    if (expanded) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClick}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                    <div className="relative">
                        <img src={imageUrl} alt={name} className="w-full h-80 object-cover bg-lavender" />
                        <button 
                            onClick={onClick}
                            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-charcoal font-bold"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-2xl font-bold text-charcoal">{name}</h3>
                                <span className="inline-block bg-peach text-xs font-semibold px-2 py-1 rounded-full text-charcoal mt-1">
                                    {breed}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{dateStr}</span>
                        </div>
                        <p className="text-gray-600 font-serif leading-relaxed mb-6">
                            {description}
                        </p>
                        
                        <div className="flex gap-3">
                            <a 
                                href={imageUrl} 
                                download={`cat_card_${name}.png`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-coral text-white py-2 rounded-lg font-bold text-center hover:bg-orange-600 transition-colors"
                            >
                                Download Art
                            </a>
                            {onDelete && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if(confirm('Meow? Are you sure you want to delete this card?')) onDelete(data.id);
                                    }}
                                    className="px-4 py-2 border-2 border-gray-200 text-gray-400 rounded-lg hover:border-red-300 hover:text-red-400 transition-colors"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Thumbnail view
    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-peach group"
        >
            <div className="aspect-square w-full overflow-hidden bg-lavender">
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-charcoal truncate">{name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{breed}</p>
                <p className="text-sm text-gray-600 font-serif line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
}