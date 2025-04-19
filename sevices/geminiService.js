// services/geminiServices.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
// wfamma install sarett npm install @google/generative-ai express-fileupload dotenv 
// badalnaa il path illi ypushi il image w il texte
//badalnaa cle API 
// badalnaa nom de la modéle
// badalna il prompt
// Initialize Gemini API
// badalna le fet illi yanalysyy il texte x ba3ed idha famma image ypushyha lil inputParts bbech yanalyseha ya3nii moch zouz ma3 b3adhhom 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyserAvisAvecImage(texte, imageBuffer) {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analyze this review and the image provided of a restaurant or shop. 
        Evaluate:
        - Sentiment of the review
        - Key points mentioned
        - Service quality
        - Atmosphere
        - Food or product quality
        - Value for money
        
        Also, check if the image is blurry, unclear, or not relevant to a restaurant or shop. 
        If so, mention that the image quality makes it difficult to provide a meaningful analysis.
        
        Then, provide a concise summary in French.`;

        
        
        // premiererment yanalysyy il texte w il inout ya3nii il texte y7ottou fi fil inputParts w yhizha m3aha il prompt 
        const inputParts = [
            { text: prompt + "\n\nReview text: " + texte }
        ];

        // idha famma image ykammel ypushihaa ma3 il texte fil inputParts
        // If an image is provided, add it to the input parts
        // ya3ni ypushi il image fil inputParts w ypushi il texte fil inputParts
        // w ypushi il prompt fil inputParts 
        if (imageBuffer) {
            inputParts.push({
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: 'image/jpeg'
                }
            });
        }

        // Generate content
        const result = await model.generateContent({
            contents: [{ role: "user", parts: inputParts }],
        });

        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error('Erreur Gemini:', error);
        throw new Error('Erreur lors de l\'analyse avec Gemini: ' + error.message);
    }
}

module.exports = { analyserAvisAvecImage };
