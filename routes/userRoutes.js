const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post("/register", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id/nom", (req, res) => userController.updateUserField(req, res, "nom"));
router.put("/users/:id/prenom", (req, res) => userController.updateUserField(req, res, "prenom"));
router.put("/users/:id/localisation", (req, res) => userController.updateUserField(req, res, "localisation"));
router.put("/users/:id/genre", (req, res) => userController.updateUserField(req, res, "genre"));
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
