const axios = require('axios');

const handleChat = async (req, res) => {
  const { message, context } = req.body;

  try {
    // ✅ PROMPT amélioré
    const prompt = `
Tu es un assistant intelligent qui recommande des shops (cafés, restaurants, hôtels, etc).

Réponds au format JSON strict uniquement, sans texte autour. N’écris rien en dehors du JSON.

Format strict attendu :
{
  "reply": "Ta réponse pour l'utilisateur ici.",
  "results": [
    {
      "name": "Nom du shop",
      "description": "Description courte du shop",
      "estimated_price": "Prix estimé en TND"
    }
  ]
}

Règles obligatoires :
- Fournis TOUJOURS une description et un prix estimé pour chaque shop.
- Même pour les cafés ou restaurants, donne une estimation claire du prix (ex. : "15-30 TND").
- Ne renvoie rien d’autre que ce format JSON strict.
- Pas de balises Markdown, pas de texte libre.

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
