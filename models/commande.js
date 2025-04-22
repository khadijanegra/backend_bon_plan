const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    date_recuperation: { type: String, required: true },
    plats_menu: { type: Array, required: true },
    prix_total: { type: Number, required: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    random_code: { type: String, required: true },
   
});

const commande = mongoose.model('commande', commandeSchema);

module.exports = commande;
