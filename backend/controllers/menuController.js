const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const { upload, uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

const createMenuItem = async (req, res) => {
    try {
        const { itemName, description, price, category } = req.body;
        if (!itemName || !price || !category)
            return res.status(400).json({ message: "itemName, price, and category are required." });

        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant)
            return res.status(404).json({ message: "Restaurant not found." });

        let imageUrl = null;
        let imagePublicId = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "menu-items");
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const menuItem = await MenuItem.create({
            restaurantId: restaurant._id,
            itemName,
            description,
            price,
            category,
            image: imageUrl,
            imagePublicId,
        });

        res.status(201).json({ message: "Menu item created.", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// GET /api/menu (owner)
const getMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant)
            return res.status(404).json({ message: "Restaurant not found" });
        const menuItems = await MenuItem.find({ restaurantId: restaurant._id });
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/menu/customer/:restaurantId
const getCustomerMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
        res.status(200).json({ restaurant, menuItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem)
            return res.status(404).json({ message: "Menu item not found." });

        const restaurant = await Restaurant.findById(menuItem.restaurantId);
        if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized." });

        const { itemName, description, price, category, available } = req.body;
        if (itemName !== undefined) menuItem.itemName = itemName;
        if (description !== undefined) menuItem.description = description;
        if (price !== undefined) menuItem.price = price;
        if (category !== undefined) menuItem.category = category;
        if (available !== undefined) menuItem.available = available;

        if (req.file) {
            await deleteFromCloudinary(menuItem.imagePublicId);
            const result = await uploadToCloudinary(req.file.buffer, "menu-items");
            menuItem.image = result.secure_url;
            menuItem.imagePublicId = result.public_id;
        }

        await menuItem.save();
        res.status(200).json({ message: "Menu item updated.", menuItem });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: "Menu item not found." });

        const restaurant = await Restaurant.findById(menuItem.restaurantId);
        if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized." });

        await deleteFromCloudinary(menuItem.imagePublicId);
        await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Menu item deleted." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { createMenuItem, getMenu, updateMenuItem, deleteMenuItem, getCustomerMenu, upload };