const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    password: String,
    role: String,
    localisation: { 
        latitude: Number, 
        longitude: Number 
      }, 
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }], // Référence aux shops
    region : {type: String}
});
const User = mongoose.model('User', userSchema);

module.exports = User;
