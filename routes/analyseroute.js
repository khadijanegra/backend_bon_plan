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

        const motsToxiques = [
            // Français
            "connard", "connasse", "enculé", "pute", "salope", "merde", "chiant", "nique ta mère", 
            "va te faire foutre", "ta gueule", "débile", "abruti", "batard", "salaud", "grosse merde",
            "sale con", "gros con", "pauvre con", "trou du cul",

            // Anglais
            "fuck", "shit", "bitch", "bastard", "asshole", "dick", "motherfucker", "fucker",
            "retard", "dumb", "idiot", "moron", "stupid", "jerk", "cunt",

            // Arabe romanisé
            "zml", "khsara", "kessmek", "nikmok", "zebi", "mrakch", "3assba", "ta7zan", "kleb", 
            "mout", "hmar", "hayawan", "sharmoota", "kss irak", "3awneh", "7mar", "kalb", "khouk",

            // Variantes censurées
            "f*ck", "sh*t", "b*tch", "conn**", "pu**", "n*que", "n1que", "ta g*", "gue*le", 
        ];

        const contientMotsToxiques = motsToxiques.some(mot =>
            texte.toLowerCase().includes(mot)
        );

        let statusReview = "good";
        let imageQuality = "clear";

        if (
            analyse.toxic === true || 
            analyse.insultes === true || 
            analyse.scoreToxicité > 0.8 || 
            contientMotsToxiques
        ) {
            statusReview = "not good";
        }

        const analyseText = typeof analyse === "string" ? analyse.toLowerCase() : JSON.stringify(analyse).toLowerCase();

        if (analyseText.includes("image floue") || analyseText.includes("blurry") || analyseText.includes("non pertinente") || analyseText.includes("not relevant")) {
            imageQuality = "blurry or irrelevant";
        }


        res.status(200).json({
            success: true,
            message: "Analyse effectuée avec succès",
            data: analyse,
            statusReview : statusReview,
            imageQuality : imageQuality,
        });

    } catch (err) {
        console.error('❌ Erreur analyse:', err);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'analyse de l'avis",
            error: err.message
        });
    }
});

module.exports = router;
