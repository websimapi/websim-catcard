const CAT_BREEDS = [
    "Persian", "Siamese", "Maine Coon", "British Shorthair", 
    "Ragdoll", "Bengal", "Scottish Fold", "Sphynx", 
    "Tabby", "Calico", "Tuxedo", "Orange Tabby", "Russian Blue",
    "Norwegian Forest", "Bombay", "Munchkin", "Ural Rex"
];

const IMAGE_STYLES = [
    "Digital Painting", "Hyper Realistic", "Photorealistic", "3D Render", 
    "Concept Art", "Anime / Manga", "Cartoon / Comic Style", "Watercolor", 
    "Oil Painting", "Pencil Sketch / Line Art", "Low Poly", 
    "Isometric Illustration", "Surreal / Dreamlike", "Fantasy Art", 
    "Sci-Fi Illustration", "Minimalist", "Matte Painting", "Pixel Art"
];

window.CreateView = function({ onSaved }) {
    const { useState } = window.React;
    const { generateCatDescription, generateCatImage } = window.AI;
    const { saveCard } = window.Storage;
    const Card = window.Card;

    const [breed, setBreed] = useState(CAT_BREEDS[0]);
    const [imageStyle, setImageStyle] = useState(IMAGE_STYLES[0]);
    const [details, setDetails] = useState("");
    const [loadingStep, setLoadingStep] = useState(0); // 0: Idle, 1: Text, 2: Image, 3: Saving
    const [generatedData, setGeneratedData] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!breed) return;
        
        setError(null);
        setLoadingStep(1);
        setGeneratedData(null);

        try {
            // Step 1: Text
            const textData = await generateCatDescription(breed, details, imageStyle);
            setGeneratedData({ ...textData, breed, imageUrl: null }); // Partial state
            
            setLoadingStep(2);

            // Step 2: Image
            const imageUrl = await generateCatImage(textData.visual_prompt);
            
            setGeneratedData(prev => ({ ...prev, imageUrl }));
            setLoadingStep(0); // Done
        } catch (err) {
            setError(err.message);
            setLoadingStep(0);
        }
    };

    const handleSave = async () => {
        if (!generatedData || !generatedData.imageUrl) return;
        setLoadingStep(3);
        try {
            await saveCard(generatedData);
            setLoadingStep(0);
            onSaved(); // Navigate to gallery
        } catch (err) {
            console.error(err);
            setError("Failed to save card.");
            setLoadingStep(0);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Input Section */}
                <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-orange-50">
                    <div>
                        <h2 className="text-2xl font-bold text-charcoal mb-4">Create New Card</h2>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Cat Type</label>
                        <div className="relative mb-4">
                            <select 
                                value={breed} 
                                onChange={(e) => setBreed(e.target.value)}
                                className="w-full p-3 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral text-charcoal appearance-none cursor-pointer"
                            >
                                {CAT_BREEDS.map(b => <option key={b} value={b}>🐱 {b}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                        </div>

                        <label className="block text-sm font-semibold text-gray-600 mb-2">Image Style</label>
                        <div className="relative">
                            <select 
                                value={imageStyle} 
                                onChange={(e) => setImageStyle(e.target.value)}
                                className="w-full p-3 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral text-charcoal appearance-none cursor-pointer"
                            >
                                {IMAGE_STYLES.map(s => <option key={s} value={s}>🎨 {s}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Personality & Details
                            <span className="text-xs font-normal text-gray-400 ml-2">({300 - details.length} chars left)</span>
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value.slice(0, 300))}
                            placeholder="Add special traits like 'loves pizza', 'wears a wizard hat', or 'afraid of cucumbers'..."
                            className="w-full h-32 p-3 bg-mint rounded-lg border-none focus:ring-2 focus:ring-coral text-charcoal resize-none placeholder-gray-400"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loadingStep > 0}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2
                            ${loadingStep > 0 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-coral text-white hover:bg-orange-600 hover:shadow-lg'}`}
                    >
                        {loadingStep === 0 ? '✨ Generate Magic' : 'Creating...'}
                    </button>
                    
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
                </div>

                {/* Preview Section */}
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    {loadingStep > 0 ? (
                        <div className="text-center space-y-4">
                            <div className="text-6xl animate-bounce">🧶</div>
                            <h3 className="text-xl font-bold text-coral">
                                {loadingStep === 1 && "Dreaming up personality..."}
                                {loadingStep === 2 && "Painting the portrait..."}
                                {loadingStep === 3 && "Saving to collection..."}
                            </h3>
                            <p className="text-gray-500 text-sm">This might take a few seconds.</p>
                        </div>
                    ) : generatedData ? (
                        <div className="w-full space-y-4">
                            <Card 
                                data={{ 
                                    ...generatedData, 
                                    created_at: new Date().toISOString() 
                                }} 
                            />
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setGeneratedData(null)}
                                    className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-mint text-charcoal font-bold rounded-lg border-2 border-transparent hover:border-coral transition-all shadow-sm"
                                >
                                    💖 Save to Collection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 border-2 border-dashed border-peach rounded-2xl p-12 w-full">
                            <div className="text-4xl mb-2 opacity-50">🐾</div>
                            <p>Your creation will appear here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}