const Shop = require('../models/shop');
const User = require('../models/user'); 

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const { shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id } = req.body;

        // Verify if the user exists
        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newShop = new Shop({ shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id });
        await newShop.save();
        res.status(201).json(newShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate('user_id', 'name email'); 
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a shop by ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('user_id', 'name email');
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a shop
exports.updateShop = async (req, res) => {
    try {
        const { shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm } = req.body;

        const updatedShop = await Shop.findByIdAndUpdate(req.params.id, 
            { shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm }, 
            { new: true });

        if (!updatedShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a shop
exports.deleteShop = async (req, res) => {
    try {
        const deletedShop = await Shop.findByIdAndDelete(req.params.id);
        if (!deletedShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
