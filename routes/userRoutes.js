const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// lil nzidou yser fil bd 
router.post("/register", userController.createUser);

// lil recupertaion de toutes les users illi fil bd 
router.get("/users", userController.getUsers);


// lil ligin mte3 il user 
router.post("/signIn",userController.signIn);
//lil recuperation user  bil id illi fil bd 
router.get("/users/:id", userController.getUserById);

//lil supprimer bil id  user mil bd 
router.delete("/users/:id", userController.deleteUser);

//lil update user 
router.put("/users/:id/nom", (req, res) => userController.updateUserField(req, res, "nom"));
router.put("/users/:id/prenom", (req, res) => userController.updateUserField(req, res, "prenom"));
router.put("/users/:id/localisation", (req, res) => userController.updateUserField(req, res, "localisation"));
router.put("/users/:id/genre", (req, res) => userController.updateUserField(req, res, "genre"));

// lil forget password 
router.post("/forgot-password", userController.forgotPassword);

// lil reset password 
router.post("/reset-password", userController.resetPassword);

router.post("/login-admin", userController.loginadmin);

router.post('/favoriclic' , userController.addToFavorites);

router.get("/users/:id/favorites", userController.getFavorites);



module.exports = router;
