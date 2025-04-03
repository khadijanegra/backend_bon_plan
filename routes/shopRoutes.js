const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');

router.post('/', shopController.createShop);
router.get('/getallshops', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);
// Route pour récupérer les shops par user_id
router.get('/user/:user_id', shopController.getShopsByUserId);

router.get('/shops/search', shopController.searchShops);
module.exports = router;
