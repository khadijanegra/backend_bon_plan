const Review = require('../models/review');
const Shop = require('../models/shop');
const User = require('../models/user');

class reviewController {
    static async createReview(req,res){
        try{
            const { note_service, note_cuisine, note_ambiance, commentaire, user_id , shop_id} = req.body; 
            
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            } 
            

            const shopExists = await Shop.findById(shop_id);
            if (!shopExists) {
                return res.status(404).json({ message: 'Shop not found' });
            }


            const newReview = new Review({ note_service, note_cuisine, note_ambiance, commentaire, user_id , shop_id});
            await newReview.save();

            res.status(201).json({ id: newReview._id, message: "Review créé avec succès" });// hedhi traja3lk response json feha les attributes mt3 shom lkol il sufiit hiai creeéé
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
       
    }


    static async fetshReview(req,res){
        try {
            const reviews = await Review.find().populate('user_id', 'shop_id'); 
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }

    

}
module.exports = reviewController;
