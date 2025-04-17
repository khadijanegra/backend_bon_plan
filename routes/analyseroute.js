const express = require('express');
const router = express.Router();
const { analyserAvisAvecImage } = require('../sevices/geminiService');

router.post('/', async (req, res) => {
    console.log("✅ Requête reçue");

    try {
        const { texte } = req.body;
        console.log("📝 Texte reçu:", texte);

        let imageBuffer = null;
        if (req.files && req.files.image) {
            imageBuffer = req.files.image.data;
            console.log("🖼️ Image reçue (taille):", imageBuffer.length);
        }

        const analyse = await analyserAvisAvecImage(texte, imageBuffer);
        console.log("✅ Réponse Gemini:", analyse);

        res.json({ analyse });

    } catch (err) {
        console.error('❌ Erreur analyse:', err);
        res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'avis', details: err.message });
    }
});

module.exports = router;
