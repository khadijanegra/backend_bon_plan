const Review = require('../models/review');
const Shops = require('../models/shop');
const Users =require('../models/user')

class DashboardController {

    //nbr des avis lkolll 
    static async countavis(req,res){
        try{
            const nbruseravis = await Review.countDocuments();
            res.status(200).json({
                totalavisusers : nbruseravis,
            })
        }catch (error){
            res.status(500).json({message:error.message });
        }
    }

    //nbr des shops lkoll 
    static async countshops(req, res){
        try{
            const nbrshops = await Shops.countDocuments();
            res.status(200).json({
                nbrtotaleshops : nbrshops,
            })
        }catch(error){
            res.status(500).json({message : error.message});
        }
    }


    //nbr des user lkolll
    static async countusers(req, res){
        try{
            const nbrusers = await Users.countDocuments();
            res.status(200).json({
                nbrtotaleusers : nbrusers,
            })
        }catch(error){
            res.status(500).json({message : error.message});
        }
    }
    //nbr manager lkoll
    static async countmanagers(req , res){
        try{
            const nbrmanager = await Users.countDocuments({role : "manager"});
            const nbrtotalemanager = nbrmanager
            res.status(200).json({nbrtotalemanager})
        }catch(error){
            res.status(500).json({ message: error.message });

        }
    }
    //nbr des visiteur lkoll
    static async countvisiteurs(req , res){
        try{
            const nbrvisiteur = await Users.countDocuments({role : "user"});
            const nbrtotaledesvisiteur = nbrvisiteur
            res.status(200).json({nbrtotaledesvisiteur});
        }catch(error){
            res.status(500).json({message: error.message});
        }
    }

    //nbr des shop (cafe)
    static async nbrshopscafe(req , res){
        try{
            const cafeshops = await Shops.countDocuments({categorie : "Café"});
            const nbrtotlaeshopcafe = cafeshops
            res.status(200).json({nbrtotlaeshopcafe});
        }catch(error){
            res.status(500).json({message: error.message});
        }
    }

    //nbr des shop (salon de the)
    static async nbrshopsalondethe(req , res){
        try{
            const salondetheshop = await Shops.countDocuments({categorie : "Salon de thé"});
            const nbrtotalesalondethe = salondetheshop
            res.status(200).json({nbrtotalesalondethe});
        }catch(error){
            res.status(500).json({message: error.message});
        }
    }

    //nbr des shop (restaurant)
    static async nbrrestaurant(req , res){
        try{
            const restaurantshop = await Shops.countDocuments({categorie : "restaurant"});
            const nbrtotlaeshoprestaurant = restaurantshop
            res.status(200).json({nbrtotlaeshoprestaurant});
        }catch(error){
            res.status(500).json({message: error.message});
        }
    }

    //nbr des shop (hotel)
    static async nbrrestaurant(req , res){
        try{
            const hotelshop = await Shops.countDocuments({categorie : "restaurant"});
            const nbrtotlaeshoprestaurant = hotelshop
            res.status(200).json({nbrtotlaeshoprestaurant});
        }catch(error){
            res.status(500).json({message: error.message});
        }
    }


    //pourcateage des categorii parapport a la totale des shops 
    static async getPourcentageShopsParCategorie(req, res) {
        try {
            const totalShops = await Shops.countDocuments();
    
            if (totalShops === 0) {
                return res.status(200).json({ message: "Aucun shop trouvé." });
            }
    
            const categories = ["Café", "Salon de thé", "Restaurant", "Hôtel"];
    
            const result = {};
    
            for (let categorie of categories) {
                const count = await Shops.countDocuments({ categorie });
                const pourcentage = (count / totalShops) * 100;
                result[categorie] = {
                    total: count,
                    pourcentage: pourcentage.toFixed(2) + "%"
                };
            }
    
            res.status(200).json({
                totalShops,
                statistiques: result
            });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    






    


    //calcule le nombre des avis positif parapport atous les avis existante 
    static async getSatisfactionStats(req, res) {
        try {
            const total = await Review.countDocuments();
            const positifs = await Review.countDocuments({
                note_cuisine: { $gte: 3 },
                note_ambiance: { $gte: 3 },
                note_service: { $gte: 3 }
            });
            const pourcentage = (positifs / total) * 100;

            res.status(200).json({
                totalAvis: total,
                avisPositifs: positifs,
                pourcentageSatisfaction: pourcentage.toFixed(2) + '%'
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }





 
}

module.exports = DashboardController;
