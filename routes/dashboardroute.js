const express = require("express");
const DashboardController = require("../controller/dashboardcontroller");

const router = express.Router();

// Route pour le nombre total des avis
router.get('/avis', DashboardController.countavis);

// Route pour le nombre total des shops
router.get('/shops', DashboardController.countshops);

// Route pour le nombre total des utilisateurs
router.get('/users', DashboardController.countusers);

// Route pour le nombre total des managers
router.get('/managers', DashboardController.countmanagers);

// Route pour le nombre total des visiteurs
router.get('/visiteurs', DashboardController.countvisiteurs);

// Route pour le calcul des proportions de visiteurs et managers
router.get('/typeusers', DashboardController.getProportionsVisiteursManagers);

// Route pour le nombre total des shops (café)
router.get('/shops/cafe', DashboardController.nbrshopscafe);

// Route pour le nombre total des shops (salon de thé)
router.get('/shops/salondethe', DashboardController.nbrshopsalondethe);

// Route pour le nombre total des shops (restaurant)
router.get('/shops/restaurant', DashboardController.nbrrestaurant);

// Route pour le nombre total des shops (hotel)
router.get('/shops/hotel', DashboardController.nbrrestaurant);

// Route pour le pourcentage des shops par catégorie
router.get('/shops/pourcentage', DashboardController.getPourcentageShopsParCategorie);

// Route pour les statistiques de satisfaction des avis (avis positifs)
router.get('/satisfaction', DashboardController.getSatisfactionStats);

module.exports = router;
