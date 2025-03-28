const { GoogleAuth } = require('google-auth-library');
const { SessionsClient } = require('@google-cloud/dialogflow');

// Initialize Google Auth client
const auth = new GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON), // Load credentials from env
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

async function createSessionClient() {
  const authClient = await auth.getClient();
  return new SessionsClient({ authClient });
}

exports.sendMessage = async (req, res) => {
    console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON); // Debugging the loaded JSON
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Message and sessionId are required" });
  }
  


  try {
    const sessionClient = await createSessionClient();  // Initialize sessionClient asynchronously
    const sessionPath = sessionClient.projectAgentSessionPath('chatbotguide-bpvc', sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en',
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
