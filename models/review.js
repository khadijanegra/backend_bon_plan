const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop', required: true }, 
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note_service: { type: Number, required: true, min: 1, max: 5 },
  note_cuisine: { type: Number, required: true, min: 1, max: 5 },
  note_ambiance: { type: Number, required: true, min: 1, max: 5 },
  commentaire: { type: String, trim: true },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
