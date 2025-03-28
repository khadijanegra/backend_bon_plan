const { SessionsClient } = require("@google-cloud/dialogflow");
const path = require("path");


// Charger la clé à partir de la variable d'environnement
const keyJson = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const sessionClient = new SessionsClient({
  credentials: keyJson, // Utiliser les credentials directement
});


exports.sendMessage = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Message and sessionId are required" });
  }

  try {
    const sessionPath = sessionClient.projectAgentSessionPath("chatbotguide-bpvc", sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;

    res.json({ response: result });
  } catch (error) {
    console.error("Error in Dialogflow request:", error);
    res.status(500).json({ error: "Dialogflow request failed" });
  }
};
