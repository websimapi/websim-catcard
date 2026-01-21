export async function generateCatDescription(catType, details) {
    const systemPrompt = `You are a creative writer for a "Cute Cat Card" generator. 
    Your goal is to create a short, whimsical personality profile for a cat based on its breed and user-provided traits.
    
    Output MUST be valid JSON with the following schema:
    {
        "name": "A cute name for the cat",
        "description": "2-3 sentences describing personality, habits, or magical traits.",
        "visual_prompt": "A detailed image generation prompt for a cute, illustrative style cat portrait. Include breed features, accessories, and setting mentioned. Style: Soft, warm, storybook illustration."
    }
    `;

    const userMessage = `Cat Breed: ${catType}. 
    Details/Traits: ${details || "Surprise me with something cute!"}.
    Make it adorable and unique.`;

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage, json: true }
            ],
            json: true
        });

        return JSON.parse(completion.content);
    } catch (error) {
        console.error("AI Text Generation Failed:", error);
        throw new Error("Failed to generate cat details.");
    }
}

export async function generateCatImage(visualPrompt) {
    try {
        const result = await websim.imageGen({
            prompt: visualPrompt,
            aspect_ratio: "1:1",
            width: 512,
            height: 512
        });
        return result.url;
    } catch (error) {
        console.error("AI Image Generation Failed:", error);
        throw new Error("Failed to generate cat image.");
    }
}