const express = require("express");
const DashboardController = require("../controller/dashboardcontroller");

const router = express.Router();

router.get('/satisfaction', DashboardController.getSatisfactionStats);
router.get('/typeusers',DashboardController.getProportionsVisiteursManagers);

module.exports = router