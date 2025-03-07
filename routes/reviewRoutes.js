const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

router.post('/postreviews', reviewController.createReview);
router.get('/getreviews/:shop_id', reviewController.fetchReviewbyid);  // Utiliser le paramètre :shop_id


module.exports = router;
