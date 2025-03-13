const Review=require('../models/review');
const Shop = require('../models/shop');
const User = require('../models/user');
const mongoose = require("mongoose");
class reviewController {
    static async createReview(req,res){
        try{
            const { note_service, note_cuisine, note_ambiance, commentaire, user_id , shop_id, date} = req.body; 
            
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            } 
            

            const shopExists = await Shop.findById(shop_id);
            if (!shopExists) {
                return res.status(404).json({ message: 'Shop not found' });
            }


            const newReview = new Review({ note_service, note_cuisine, note_ambiance, commentaire, user_id , shop_id , date});
            await newReview.save();

            res.status(201).json({ id: newReview._id, message: "Review créé avec succès" });// hedhi traja3lk response json feha les attributes mt3 shom lkol il sufiit hiai creeéé
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
       
    }


   static async fetchReviewbyid(req, res) {
        const { shop_id } = req.params;  // Récupérer le shop_id de l'URL
     

        // Vérifier si l'ID du shop est valide
        if (!mongoose.Types.ObjectId.isValid(shop_id)) {
            return res.status(400).json({ message: "Invalid shop ID" });
        }

        try {
            const reviews = await Review.find({ shop_id }).populate('user_id', 'nom prenom email'); // Correction ici
            if (!reviews.length) {
                return res.status(404).json({ message: "No reviews found for this shop" });
            }
            res.status(200).json(reviews);
        } catch (error) {
            console.log("Error:", error);  // Log de l'erreur
            res.status(500).json({ message: error.message });
        }
    }
    
    
      
    

    

}
module.exports = reviewController;
