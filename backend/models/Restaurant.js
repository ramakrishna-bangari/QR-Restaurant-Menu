const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: [true, "Restaurant name is required"],
            trim: true,
        },
        logo: {
            type: String,
            default: null,
        },
        logoPublicId: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        qrCode: {
            type: String,
            default: null,
        },
        menuUrl: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Restaurant", restaurantSchema);