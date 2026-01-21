window.Card = function({ data, expanded = false, onClick, onDelete }) {
    const React = window.React;
    const { name, breed, description, imageUrl, created_at } = data;
    
    const dateStr = new Date(created_at).toLocaleDateString();

    const handlePrint = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.print();
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.currentTarget;
        const originalText = btn.innerText;
        btn.innerText = "Preparing...";
        btn.disabled = true;

        try {
            // Fetch the image as a blob
            // Using a cache-buster can help with some browser CORS caching quirks
            const fetchUrl = imageUrl.includes('?') ? `${imageUrl}&t=${Date.now()}` : `${imageUrl}?t=${Date.now()}`;
            const response = await fetch(fetchUrl, {
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            // Clean filename: remove special characters, replace spaces with underscores
            const safeName = name.replace(/[^\w\s-]/gi, '').trim().replace(/\s+/g, '_');
            link.download = `${safeName}_cat_card.png`;
            
            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Release the blob URL after a short delay
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
            console.error('Blob download failed:', err);
            // Fallback: standard anchor download attribute (might still open in new tab if CORS prevents blob)
            const link = document.createElement('a');
            link.href = imageUrl;
            link.target = "_blank";
            link.download = `${name.replace(/\s+/g, '_')}_card.png`;
            link.click();
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };

    if (expanded) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm print:bg-transparent print:p-0 print:block" onClick={onClick}>
                <div 
                    className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col transform transition-all scale-100 print-container print-remove-scroll" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative shrink-0 flex items-center justify-center overflow-hidden" style={{
                        backgroundImage: 'url("cat_paw_pattern.png")',
                        backgroundSize: '120px',
                        backgroundRepeat: 'repeat'
                    }}>
                        <img 
                            src={imageUrl} 
                            alt={name} 
                            className="w-full h-auto max-h-[50vh] object-contain relative z-0 print:max-h-none" 
                        />
                        <button 
                            onClick={onClick}
                            className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white text-charcoal shadow-sm backdrop-blur-sm transition-transform active:scale-95 z-10 no-print"
                            aria-label="Close"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 overflow-y-auto flex-1 flex flex-col min-h-0 print-remove-scroll">
                        <div className="flex justify-between items-start mb-2 shrink-0">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-charcoal leading-tight">{name}</h3>
                                <span className="inline-block bg-peach/50 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full text-charcoal mt-1 border border-peach/50">
                                    {breed}
                                </span>
                            </div>
                            <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap ml-2 pt-1 font-mono">{dateStr}</span>
                        </div>
                        
                        <div className="overflow-y-auto min-h-0 mb-4 pr-1 print-remove-scroll">
                            <p className="text-sm text-gray-600 font-serif leading-relaxed">
                                {description}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 md:gap-3 mt-auto shrink-0 pt-2 border-t border-gray-50 no-print">
                            <button 
                                onClick={handleDownload}
                                className="flex-1 min-w-[120px] bg-peach text-charcoal py-2 md:py-3 rounded-lg font-bold text-center text-sm md:text-base hover:bg-orange-200 transition-colors shadow-sm"
                            >
                                💾 Download
                            </button>
                            <button 
                                onClick={handlePrint}
                                className="flex-1 min-w-[120px] bg-coral text-white py-2 md:py-3 rounded-lg font-bold text-center text-sm md:text-base hover:bg-orange-600 transition-colors shadow-sm"
                            >
                                🖨️ Print Card
                            </button>
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
            className="h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-peach group flex flex-col"
        >
            <div className="w-full flex-1 overflow-hidden relative min-h-0" style={{
                backgroundImage: 'url("cat_paw_pattern.png")',
                backgroundSize: '80px',
                backgroundRepeat: 'repeat'
            }}>
                <img 
                    src={imageUrl} 
                    alt={name} 
                    className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="p-3 md:p-4 flex flex-col shrink-0 max-h-[45%]">
                <h3 className="font-bold text-lg text-charcoal truncate shrink-0">{name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 shrink-0">{breed}</p>
                <div className="overflow-hidden relative min-h-[2.5rem]">
                    <p className="text-sm text-gray-600 font-serif line-clamp-4 md:line-clamp-6 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}