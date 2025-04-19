const axios = require('axios');

const handleChat = async (req, res) => {
  const { message, context } = req.body;

  try {
    const prompt = `
Tu es un assistant intelligent. Donne-moi la réponse au format JSON strict uniquement, sans texte autour.
Format attendu :
{
  "reply": "Ta réponse ici",
  "results": [ ... ]
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

    let botReply = response.data.candidates[0].content.parts[0].text;

    // 🔧 Nettoyer la réponse (enlever les ```json et ```)
    botReply = botReply.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    let jsonReply;
    try {
      jsonReply = JSON.parse(botReply);
    } catch (parseError) {
      return res.json({ reply: botReply, error: "❌ La réponse n’était pas un JSON valide même après nettoyage." });
    }

    res.json(jsonReply);

  } catch (error) {
    console.error('🔥 ERREUR DÉTAILLÉE GEMINI 🔥', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la communication avec Gemini.' });
  }
};

module.exports = { handleChat };