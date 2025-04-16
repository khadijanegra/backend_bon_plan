// backend/webhook.js
const express = require("express");
const router = express.Router();
const Shop = require("./models/Shop"); // ton modèle Mongoose

router.post("/webhook", async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  if (intent === "hotels_sousse") {
    try {
      const hotels = await Shop.find({
        type: "hotel",
        ville: { $regex: /sousse/i }
      });

      if (hotels.length === 0) {
        return res.json({
          fulfillmentText: "Je n'ai trouvé aucun hôtel à Sousse pour le moment."
        });
      }

      const hotelsList = hotels
        .map(hotel => `🏨 ${hotel.nom} - 📞 ${hotel.telephone || "non fourni"}`)
        .join("\n");

      return res.json({
        fulfillmentText: `Voici les hôtels que je te recommande à Sousse :\n${hotelsList}`
      });

    } catch (err) {
      return res.json({
        fulfillmentText: "Une erreur est survenue lors de la recherche des hôtels à Sousse."
      });
    }
  } else {
    return res.json({ fulfillmentText: "Intent non géré." });
  }
});

module.exports = router;
