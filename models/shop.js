const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  shop_nom: {type : String,required : true},
  phone:String,
  shop_desc: String,
  shop_local: { type: String, required: true }, 
  shop_date_ouv: String,
  shop_date_ferm: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});

const shop = mongoose.model('shop', userSchema);

module.exports = shop;
