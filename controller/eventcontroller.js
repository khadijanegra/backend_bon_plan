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



    static async fetchEventById(req, res) {
        const { event_id } = req.params; // Récupérer l'ID de l'événement de l'URL

        // Vérifier si l'ID de l'événement est valide
        if (!mongoose.Types.ObjectId.isValid(event_id)) {
            return res.status(400).json({ message: "ID d'événement invalide" });
        }

        try {
            const event = await Event.findById(event_id).populate('shop_id', 'shop_nom');

            // Si l'événement n'est pas trouvé, retourner un message d'erreur
            if (!event) {
                return res.status(404).json({ message: "Événement non trouvé" });
            }

            res.status(200).json(event); // Retourner l'événement trouvé
        } catch (error) {
            console.log("Error:", error); // Log de l'erreur
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = EventController;
