const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  shop_nom: {type : String,required : true},
  shop_desc: String,
  shop_local: { type: String, required: true }, 
  shop_date_ouv: String,
  shop_date_ferm: String,
});

const shop = mongoose.model('shop', userSchema);

module.exports = shop;
