const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: String,
  email: String,
  prenom: String,
  password: String,
  localisation: String,
  genre: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
