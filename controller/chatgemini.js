const axios = require('axios');
const Shop = require('../models/shop');

const handleChat = async (req, res) => {
  const { message } = req.body;

  try {
    // 🔍 Étape 1 : Extraire région et catégorie (simplifié ici)
    const regions = ["tunis", "sousse", "sfax", "bizerte", "nabeul", "djerba"];
    const categories = ["restaurant", "café", "hôtel"];
    
    const lowerMessage = message.toLowerCase();
    const region = regions.find(r => lowerMessage.includes(r)) || "";
    const categorie = categories.find(c => lowerMessage.includes(c)) || "";

    // 🔍 Étape 2 : Chercher dans la base MongoDB
    let dbResults = [];

    if (region && categorie) {
      const rawResults = await Shop.find({
        region: new RegExp(region, 'i'),
        categorie: new RegExp(categorie, 'i'),
      }).limit(5);

      dbResults = rawResults.map(shop => ({
        name: shop.shop_nom,
        description: shop.shop_desc || "Description non fournie.",
        estimated_price: shop.price_reservation
          ? `${shop.price_reservation}-40 TND`
          : (categorie === "restaurant"
            ? "20-40 TND"
            : categorie === "café"
            ? "10-20 TND"
            : "100-300 TND"),
      }));
    }

    // 🧠 Étape 3 : Construire le prompt
    const prompt = `
Tu es un assistant intelligent qui recommande des shops (cafés, restaurants, hôtels, etc).

Voici des shops de ma base de données :
${JSON.stringify(dbResults, null, 2)}

Propose aussi d'autres suggestions similaires (génératives).
Réponds au format JSON strict uniquement, sans texte autour :

{
  "reply": "Ta réponse pour l'utilisateur ici.",
  "results": [
    {
      "name": "Nom du shop",
      "description": "Description courte du shop",
      "estimated_price": "Fourchette de prix estimée en TND"
    }
  ]
}

Question utilisateur : ${message}
`;

    // 🤖 Étape 4 : Appel à Gemini
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.CHATGEMI_key,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    // 🔍 Debug brut
    console.log("Réponse de Gemini:", response.data);

    // 🧼 Nettoyage
    let botReply = response.data.candidates[0].content.parts[0].text;
    botReply = botReply.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    let jsonReply;
    try {
      jsonReply = JSON.parse(botReply);
    } catch (parseError) {
      console.error("❌ Erreur de parsing JSON :", parseError.message);
      return res.status(500).json({
        reply: botReply,
        error: "La réponse n’était pas un JSON valide même après nettoyage.",
      });
    }

    res.json(jsonReply);

  } catch (error) {
    console.error('🔥 ERREUR DÉTAILLÉE GEMINI 🔥', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec Gemini ou MongoDB.' });
  }
};

module.exports = { handleChat };
