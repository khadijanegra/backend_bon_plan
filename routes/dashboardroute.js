const express = require("express");
const DashboardController = require("../controller/dashboardcontroller");

const router = express.Router();

router.get('/satisfaction', DashboardController.getSatisfactionStats);

module.exports = router