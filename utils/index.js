const { MeiliSearch } = require('meilisearch');
const mongoose = require('mongoose');
require('dotenv').config();
const client = new MeiliSearch({
    host: process.env.MEILISEARCH_HOST,
    apiKey: process.env.MEILISEARCH_API_KEY
});
const Shop = require('../models/shop'); // Assure-toi que ton modèle Shop est bien défini
const indexShops = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const shops = await Shop.find(); // Récupérer les établissements
        const formattedShops = shops.map(shop => ({
            id: shop._id.toString(),
            shop_nom: shop.shop_nom,
            categorie: shop.categorie,
            shop_local: shop.shop_local,
            shop_date_ouv: shop.shop_date_ouv,
            shop_date_ferm: shop.shop_date_ferm,
            shopImage: shop.shopImage,
            service:shop.service
        }));
        const index = client.index('shops'); // Créer un index "shops"
        await index.addDocuments(formattedShops);
        console.log('Indexation réussie !');
        mongoose.connection.close();
    } catch (error) {
        console.error('Erreur d’indexation:', error);
    }
};
indexShops();