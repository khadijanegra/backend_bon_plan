const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');

router.post('/postreviews', reviewController.createReview);
router.get('/getreviews',reviewController.fetshReview);

module.exports = router;
