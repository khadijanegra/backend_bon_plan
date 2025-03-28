const express = require("express");
const { sendMessage } = require("../controllers/chatbotController");

const router = express.Router();

// Route pour gérer les messages du chatbot
router.post("/", sendMessage);

module.exports = router;
