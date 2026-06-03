const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const User = require("../models/User");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
const { upload, uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
dotenv.config();

const createRestaurant = async (req, res) => {
    try {
        const { restaurantName, address, phone } = req.body;
        const owner = await User.findById(req.user._id);

        if (!owner)
            return res.status(404).json({ success: false, message: "Owner not found" });

        const existingRestaurant = await Restaurant.findOne({ ownerId: owner._id });
        if (existingRestaurant)
            return res.status(400).json({ message: "Owner can have only one restaurant" });
        let logoUrl = null;
        let logoPublicId = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "restaurant-logos");
            logoUrl = result.secure_url;
            logoPublicId = result.public_id;
        }
        const restaurant = new Restaurant({
            restaurantName,
            address,
            phone,
            logo: logoUrl,
            logoPublicId,
            ownerId: owner._id
        });

        const savedRestaurant = await restaurant.save();
        const menuUrl = `${process.env.FRONTEND_URL}/menu/${savedRestaurant._id}`;
        const qrCode = await QRCode.toDataURL(menuUrl);
        savedRestaurant.menuUrl = menuUrl;
        savedRestaurant.qrCode = qrCode;
        await savedRestaurant.save();

        res.status(201).json({ success: true, message: "Restaurant created successfully", restaurant: savedRestaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get My Restaurant
const getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
        if (!restaurant)
            return res.status(404).json({ message: "Restaurant not found" });
        res.status(200).json({ success: true, restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Restaurant
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant)
            return res.status(404).json({ message: "Restaurant not found" });
        if (restaurant.ownerId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized" });

        const { restaurantName, address, phone, isActive } = req.body;
        if (restaurantName) restaurant.restaurantName = restaurantName;
        if (address) restaurant.address = address;
        if (phone) restaurant.phone = phone;
        if (isActive !== undefined) restaurant.isActive = isActive;

        if (req.file) {
            await deleteFromCloudinary(restaurant.logoPublicId);
            const result = await uploadToCloudinary(req.file.buffer, "restaurant-logos");
            restaurant.logo = result.secure_url;
            restaurant.logoPublicId = result.public_id;
        }
        await restaurant.save();
        res.status(200).json({ success: true, message: "Restaurant updated successfully", restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: "No Restaurant to Update" });
    }
};

// Delete Restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant)
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        if (restaurant.ownerId.toString() !== req.user._id.toString())
            return res.status(403).json({ success: false, message: "Not authorized" });

        await deleteFromCloudinary(restaurant.logoPublicId);
        await MenuItem.deleteMany({ restaurantId: req.params.restaurantId });
        await Order.deleteMany({ restaurantId: req.params.restaurantId });
        await Restaurant.findByIdAndDelete(req.params.restaurantId);
        res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createRestaurant, getMyRestaurant, updateRestaurant, deleteRestaurant, upload };