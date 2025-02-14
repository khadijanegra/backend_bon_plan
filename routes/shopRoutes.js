const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');

router.post('/', shopController.createShop);
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

module.exports = router;
