window.App = function() {
    const { useState } = window.React;
    const CreateView = window.CreateView;
    const GalleryView = window.GalleryView;

    const [view, setView] = useState('create'); // 'create' | 'gallery'

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => setView('create')}
                    >
                        <span className="text-2xl">🐱</span>
                        <h1 className="text-xl font-bold tracking-tight text-charcoal">Cute Cat Cards</h1>
                    </div>
                    
                    <nav className="flex items-center gap-1 md:gap-4">
                        <button 
                            onClick={() => setView('create')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors
                                ${view === 'create' ? 'bg-lavender text-charcoal' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Create
                        </button>
                        <button 
                            onClick={() => setView('gallery')}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors
                                ${view === 'gallery' ? 'bg-lavender text-charcoal' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Collection
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {view === 'create' && <CreateView onSaved={() => setView('gallery')} />}
                {view === 'gallery' && <GalleryView />}
            </main>

            {/* Footer */}
            <footer className="bg-white py-6 border-t border-gray-100 mt-auto">
                <div className="text-center text-sm text-gray-400">
                    Made with 🧶 and 🐟 by AI
                </div>
            </footer>
        </div>
    );
}