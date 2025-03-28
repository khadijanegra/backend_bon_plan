const Shop = require('../models/shop');
const User = require('../models/user');





const { MeiliSearch } = require('meilisearch');
const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY
});

class ShopController {
    // Create a new shop
    static async createShop(req, res) {
        try {
            const { shop_nom, phone, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id , shopImage , categorie , region} = req.body; // les attributs mt3 shom hatinehom f req 

            // Verify if the user exists 
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            } // <== hne kbal ma yasna3 shom nhb nmchi nchoufou si sayed heda howa deja m3ana wala le mawjoud ou nn 

            const newShop = new Shop({ shop_nom, phone, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id ,shopImage,categorie , region });
            await newShop.save();

            // Update user role to "manager" after creating a shop
            await User.findByIdAndUpdate(user_id, { role: 'manager' });

            res.status(201).json({ id: newShop._id, message: "Shop créé avec succès" });// hedhi traja3lk response json feha les attributes mt3 shom lkol il sufiit hiai creeéé
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get all shops
    static async getAllShops(req, res) {
        try {
            const shops = await Shop.find().populate('user_id', 'name email'); 
            res.status(200).json(shops);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a shop by ID
    static async getShopById(req, res) {
        try {
            const shop = await Shop.findById(req.params.id).populate('user_id', 'name email');
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.status(200).json(shop);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



    static async searchShops (req, res) {
        try {
            const { query, categorie } = req.query;
            const index = client.index('shops');
    
            const searchParams = categorie ? { filter: `categorie = "${categorie}"` } : {};
            
            const results = await index.search(query || '', searchParams);
            console.log("Search Results: ", results);  // Log the full result to debug
    
            res.json(results.hits);
        } catch (error) {
            console.error('Erreur de recherche:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    };
    





    // Get shops by user ID
    static async getShopsByUserId(req, res) {
        try {
            const shops = await Shop.find({ user_id: req.params.user_id  }).populate('user_id', 'name email');
            if (!shops.length) {
                return res.status(404).json({ message: 'No shops found for this user' });
            }
            res.status(200).json(shops);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a shop
    static async updateShop(req, res) {
        try {
            const { phone, shop_desc, shop_date_ouv, shop_date_ferm } = req.body;

            const updatedShop = await Shop.findByIdAndUpdate(req.params.id, 
                { phone , shop_desc, shop_date_ouv, shop_date_ferm }, 
                { new: true });

            if (!updatedShop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.status(200).json(updatedShop);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete a shop
    static async deleteShop(req, res) {
        try {
            const deletedShop = await Shop.findByIdAndDelete(req.params.id);
            if (!deletedShop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.status(200).json({ message: 'Shop deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



   
}

module.exports = ShopController;
