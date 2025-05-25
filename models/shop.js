const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  shop_nom: {type : String, required : true},
  phone: String,
  shop_desc: String,
  shop_local: { type: String, required: true }, 
  shop_date_ouv: String,
  shop_date_ferm: String,
  shopImage : String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
  categorie : String,
  region : String,
  service: { type: [String], required: true },
  visites: { type: Number, default: 0 },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  price_reservation: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
});
shopSchema.index({ shop_nom: 1 });
shopSchema.index({ region: 1 });
shopSchema.index({ categorie: 1 });
shopSchema.index({ user_id: 1 });

const shop = mongoose.model('Shop', userSchema);

module.exports = shop;
