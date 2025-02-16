const Shop = require('../models/shop');
const User = require('../models/user'); 

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const { shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id } = req.body; // les attributs mt3 shom hatinehom f req 

        // Verify if the user exists 
        const userExists = await User.findById(user_id);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        } // <== hne kbal ma yasna3 shom nhb nmchi nchoufou si sayed heda howa deja m3ana wala le mawjoud ou nn 

        const newShop = new Shop({ shop_nom, shop_desc, shop_local, shop_date_ouv, shop_date_ferm, user_id }); 
        await newShop.save();
        res.status(201).json(newShop);// hedhi traja3lk response json feha les attributes mt3 shom lkol il sufiit hiai creeéé
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate('user_id', 'name email'); // shop.find tjiblk tous les shops ; 
        // populate [thot hne id user et  nmae/email ] populate ki thot feha id temchi tjiblk les infos lkol ili teb3in el id hedha 
        // blougha okhra tjiblk les il name wl email ili teb3in il id hedha : yaani ahna ki nhoto populate al user id w nhoto name w email
        //  hia bch tmchi ll user id hedha ou tjiblo name o email bch ahna narfo sayed moula l shop : hia bch traja3 hnee object 
        // ken je mghir populate o juste jebt il id bch tab9a shop feha id aama net3eb w eni nlawj al id hedha teba3 ana sayed !! w wa9t nhot populate 
        // o nateha name w email tsahl alia l3amalia tji f shop tjiblk id o thellk {nem : www / email:www }keyeno tmchi tjibhom wahdha 


        res.status(200).json(shops); //[traja3lk la liste des shop eli associee ll user hdee :san3hom l user hedha ]
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
