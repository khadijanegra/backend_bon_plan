const axios = require('axios');

const handleChat = async (req, res) => {
  const { message, context } = req.body;

  try {
    // Création du prompt à envoyer à Gemini
    const prompt = `
Tu es un assistant intelligent. Donne-moi la réponse au format JSON strict uniquement, sans texte autour.
Format attendu :
{
  "reply": "Ta réponse ici",
  "results": [ ... ]
}

Question utilisateur : ${message}
`;

    // Appel à l'API Gemini
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

    // Affichage de la réponse de l'API après l'appel
    console.log("Réponse de l'API:", response.data); // Affiche les données de la réponse

    // Récupération de la réponse du chatbot
    let botReply = response.data.candidates[0].content.parts[0].text;

    // 🔧 Nettoyage de la réponse pour enlever les balises markdown comme ```json et ```
    botReply = botReply.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    let jsonReply;
    try {
      // Tentative de parsing de la réponse nettoyée en JSON
      jsonReply = JSON.parse(botReply);
    } catch (parseError) {
      console.error("❌ Erreur lors du parsing JSON :", parseError.message);
      return res.status(500).json({ reply: botReply, error: "La réponse n’était pas un JSON valide même après nettoyage." });
    }

    // Envoi de la réponse formatée correctement
    res.json(jsonReply);

  } catch (error) {
    console.error('🔥 ERREUR DÉTAILLÉE GEMINI 🔥', error.response?.data || error.message);

    // Envoi d'une erreur serveur en cas de problème avec l'API Gemini
    res.status(500).json({ error: 'Erreur lors de la communication avec Gemini.' });
  }
};

module.exports = { handleChat };
