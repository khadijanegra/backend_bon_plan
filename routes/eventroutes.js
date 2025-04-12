const express = require('express');
const router = express.Router();
const EventController = require('../controller/eventcontroller');

router.post('/createvent', EventController.createEvent);
router.get('/getevent/:shop_id', EventController.getEventByShopId);  // Utiliser le paramètre :shop_id
router.get('/getallevents', EventController.getAllEvents);


module.exports = router;
