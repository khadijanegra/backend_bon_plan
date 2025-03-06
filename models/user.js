const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    role: String,
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }] // Référence aux shops
});

const User = mongoose.model('User', userSchema);

module.exports = User;
