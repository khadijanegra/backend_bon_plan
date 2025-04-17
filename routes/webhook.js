// backend/webhook.js
const express = require("express");
const router = express.Router();
const Shop = require("../models/shop"); // Ton modèle Mongoose

router.post("/webhook", async (req, res) => {
  // On récupère le message et la réponse du body envoyé depuis React Native
  const { message, response, sessionId } = req.body;

  console.log("Message reçu:", message);
  console.log("Réponse envoyée au bot:", response);
  console.log("ID de session:", sessionId);

  // Traitement du message
  if (message.toLowerCase().includes("hôtel") && message.toLowerCase().includes("sousse")) {
    try {
      const hotels = await Shop.find({
        categorie: "Hôtel",
        region: { $regex: /sousse/i } // Recherche de l'hôtel dans la région Sousse
      });

      if (hotels.length === 0) {
        return res.json({
          fulfillmentText: "Je n'ai trouvé aucun hôtel à Sousse pour le moment."
        });
      }

      const hotelsList = hotels
        .map(shop => `🏨 ${shop.shop_nom} - 📞 ${shop.phone || "non fourni"}`)
        .join("\n");

      return res.json({
        fulfillmentText: `Voici les hôtels que je te recommande à Sousse :\n${hotelsList}`
      });

    } catch (err) {
      console.error("Erreur de recherche des hôtels:", err);
      return res.json({
        fulfillmentText: "Une erreur est survenue lors de la recherche des hôtels à Sousse."
      });
    }
  } else {
    return res.json({ fulfillmentText: "Je ne suis pas sûr de ce que tu cherches. Peux-tu préciser ?" });
  }
});

module.exports = router;
