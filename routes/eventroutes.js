const express = require('express');
const router = express.Router();
const EventController = require('../controller/eventcontroller');

router.post('/createvent', EventController.createEvent);
router.get('/getevent/:event_id', EventController.fetchEventById);  // Utiliser le paramètre :shop_id


module.exports = router;
