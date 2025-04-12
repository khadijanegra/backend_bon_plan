const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');


router.get('/top-shops', shopController.getTopShops);
router.post('/', shopController.createShop);
router.get('/getallshops', shopController.getAllShops);
router.get('/shops/search', shopController.searchShops);
router.get('/user/:user_id', shopController.getShopsByUserId);
router.put('/:id/visites', shopController.incrementVisites);

// 🚨 CES TROIS ROUTES EN DERNIER
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

module.exports = router;
