const express = require('express');
const router = express.Router();
const CommandeController = require('../controller/commandecontroller');

// Route to create a new order
router.post('/createcommande', CommandeController.createCommande);
// Route to get all orders
router.get('/getallcommandes', CommandeController.getAllCommandes);
module.exports = router;