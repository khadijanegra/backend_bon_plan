const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: String,
  email: { type: String, unique: true, required: true },  
  prenom: String,
  password: { type: String, required: true }, 
  localisation: { 
    latitude: Number, 
    longitude: Number 
  }, 
  role: { type: String, default: 'user' },
  favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
