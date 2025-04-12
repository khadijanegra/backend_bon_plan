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
            const { 
                shop_nom, 
                phone, 
                shop_desc, 
                shop_local, 
                shop_date_ouv, 
                shop_date_ferm, 
                user_id, 
                shopImage, 
                categorie, 
                region,
                service,
                price_reservation 
            } = req.body;

            // Verify if the user exists 
            const userExists = await User.findById(user_id);
            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newShop = new Shop({ 
                shop_nom, 
                phone, 
                shop_desc, 
                shop_local, 
                shop_date_ouv, 
                shop_date_ferm, 
                user_id,
                shopImage,
                categorie, 
                region, 
                service, 
                visites: 0,
                price_reservation: price_reservation || 0
            });
            await newShop.save();

            // Update user role to "manager" after creating a shop
            await User.findByIdAndUpdate(user_id, { role: 'manager' });

            setTimeout(() => {
                res.status(201).json({ id: newShop._id, message: "Shop créé avec succès" });
            }, 1000);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



static async incrementVisites(req, res) {
    try {
        const { id } = req.params; // Récupérer l'ID du shop à partir des paramètres d'URL
        const shop = await Shop.findById(id);  // Trouver le shop par ID

        if (!shop) {
            return res.status(404).json({ message: 'Shop non trouvé' });
        }

        // Incrémenter le nombre de visites
        shop.visites += 1;
        await shop.save();  // Sauvegarder la mise à jour dans la base de données

        console.log(`Nombre de visites mis à jour pour le shop ${id}: ${shop.visites}`);
        res.status(200).json({ message: `Nombre de visites mis à jour pour le shop ${id}`, visites: shop.visites });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des visites:', error);
        res.status(500).json({ message: error.message });
    }
}




    // Get all shops
    static async getAllShops(req, res) {
        try {
            const shops = await Shop.find().populate('user_id', 'name email');
            console.log(shops);  // Pour vérifier les données retournées par la DB
            res.status(200).json(shops);
        } catch (error) {
            console.error(error);  // Pour afficher l'erreur
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

    static async getTopShops(req, res) {
        try {
            const topShops = await Shop.aggregate([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'shop_id',
                        as: 'reviews'
                    }
                },
                {
                    $addFields: {
                        positiveReviews: {
                            $filter: {
                                input: '$reviews',
                                as: 'review',
                                cond: {
                                    $and: [
                                        { $gte: ['$$review.note_cuisine', 3] },
                                        { $gte: ['$$review.note_service', 4] },
                                        { $gte: ['$$review.note_ambiance', 5] }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        positiveReviewCount: { $size: '$positiveReviews' }
                    }
                },
                {
                    $match: {
                        positiveReviewCount: { $gt: 0 }
                    }
                },
                {
                    $sort: {
                        positiveReviewCount: -1
                    }
                },
                {
                    $limit: 5
                },
                {
                    $project: {
                        shop_nom: 1,
                        shop_desc: 1,
                        shop_local: 1,
                        shopImage: 1,
                        categorie: 1,
                        positiveReviewCount: 1
                    }
                }
            ]);
            
    
            res.status(200).json(topShops);
        } catch (error) {
            console.error('Erreur lors de la récupération des top shops :', error);
            res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = ShopController;
