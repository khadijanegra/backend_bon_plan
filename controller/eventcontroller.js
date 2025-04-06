const Event = require('../models/event');
const Shop = require('../models/shop');
const mongoose = require("mongoose");

class EventController {
    static async createEvent(req, res) {
        try {
            const { titre, description, date_debut, date_fin, prix, limite, nbr_place, shop_id } = req.body;

            // Vérifie si le shop existe avant de créer l'événement
            const shopExists = await Shop.findById(shop_id);
            if (!shopExists) {
                return res.status(404).json({ message: 'Le shop avec cet ID n\'existe pas.' });
            }

            // Créer un nouvel événement
            const newEvent = new Event({ titre, description, date_debut, date_fin, prix, limite, nbr_place, shop_id });
            await newEvent.save();

            // Retourne une réponse de succès
            return res.status(201).json({
                id: newEvent._id,
                message: "Événement créé avec succès",
                event: newEvent // Optionnel : tu peux retourner les détails de l'événement créé ici
            });
        } catch (error) {
            // Gérer les erreurs
            res.status(500).json({ message: error.message });
        }
    }



    static async getEventByShopId(req, res) {
        const { shop_id } = req.params;
    
        try {
            // Chercher l'événement lié à ce shop
            const event = await Event.findOne({ shop_id });
    
            if (!event) {
                return res.status(404).json({ message: 'No event found for this shop' });
            }
    
            res.status(200).json(event); // Renvoie l'événement complet
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    
}
module.exports = EventController;
