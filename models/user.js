const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    role: String,
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }] // Référence aux shops
});

module.exports = mongoose.model('User', userSchema);
