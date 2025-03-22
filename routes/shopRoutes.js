const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');

router.post('/', shopController.createShop);
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);
// Route pour récupérer les shops par user_id
router.get('/user/:user_id', shopController.getShopsByUserId);
router.get('/shoops/cafes', shopController.getCafes); // Ajout de la nouvelle route
module.exports = router;
