const axios = require('axios');

const handleChat = async (req, res) => {
  const { message, context } = req.body;

  try {
    // ✅ PROMPT amélioré
    const prompt = `
Tu es un assistant intelligent qui recommande des shops (cafés, restaurants, hôtels, etc).

Réponds au format JSON strict uniquement, sans texte autour.

Format strict attendu :
{
  "reply": "Ta réponse pour l'utilisateur ici.",
  "results": [
    {
      "name": "Nom du shop",
      "description": "Description courte du shop",
      "estimated_price": "Fourchette de prix estimée en TND, exemple: '15-30 TND'"
    }
  ]
}

Règles obligatoires :
- Fournis TOUJOURS une description et un prix estimé pour chaque shop.
- Si tu ne connais pas le prix exact, fais une estimation raisonnable basée sur le type (ex. : cafés: 10-20 TND, restos: 20-40 TND, hôtels: 100-300 TND).
- N’écris aucun texte en dehors du JSON.
- Pas de balises Markdown, pas de texte libre.

Exemple :
{
  "reply": "Voici quelques cafés sympas à Sousse avec un budget de 200 TND.",
  "results": [
    {
      "name": "Café El Medina",
      "description": "Café traditionnel au cœur de la médina avec une ambiance authentique.",
      "estimated_price": "10-25 TND"
    },
    {
      "name": "Sky Lounge",
      "description": "Café moderne avec vue panoramique et boissons variées.",
      "estimated_price": "20-40 TND"
    }
  ]
}

Question utilisateur : ${message}
`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=' + process.env.CHATGEMI_key,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    // 🔍 Affichage brut (debug)
    console.log("Réponse de l'API:", response.data);

    // 🧼 Nettoyage
    let botReply = response.data.candidates[0].content.parts[0].text;
    botReply = botReply.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    let jsonReply;
    try {
      jsonReply = JSON.parse(botReply);
    } catch (parseError) {
      console.error("❌ Erreur lors du parsing JSON :", parseError.message);
      return res.status(500).json({ reply: botReply, error: "La réponse n’était pas un JSON valide même après nettoyage." });
    }

    res.json(jsonReply);

  } catch (error) {
    console.error('🔥 ERREUR DÉTAILLÉE GEMINI 🔥', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec Gemini.' });
  }
};

module.exports = { handleChat };
