const Shop = require('../models/shop');
const User = require('../models/user');
const Commande = require('../models/commande');

class CommandeController {
    static async createCommande(req, res) {
        try {
            const { date_creation ,date_recuperation, plats_menu, prix_total, user_id, shop_id, random_code} = req.body;

            // Vérifie si le shop existe avant de créer la commande
            const shopExists = await Shop.findById(shop_id);
            if (!shopExists) {
                return res.status(404).json({ message: 'Le shop avec cet ID n\'existe pas.' });
            }

            // Vérifie si l'utilisateur existe avant de créer la commande
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ message: 'L\'utilisateur avec cet ID n\'existe pas.' });
            }

            // Créer une nouvelle commande
            const newCommande = new Commande({  date_creation ,date_recuperation, plats_menu, prix_total, user_id, shop_id , random_code });
            await newCommande.save();

            // Retourne une réponse de succès
            return res.status(201).json({
                id: newCommande._id,
                message: "Commande créée avec succès",
                commande: newCommande // Optionnel : tu peux retourner les détails de la commande créée ici
            });
        } catch (error) {
            // Gérer les erreurs
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllCommandes(req, res) {
        try {
            const commandes = await Commande.find().populate('user_id').populate('shop_id');
            res.status(200).json(commandes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
module.exports = CommandeController;
