const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    prix: { type: Number, required: true },
    limite : {type : Boolean , required : true},
    nbr_place : {type : Number , required : true},
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
});

const event = mongoose.model('event', eventSchema);

module.exports = event;
