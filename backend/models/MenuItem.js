const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema(
    {
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Restaurant model
            ref: "Restaurant",
            required: true,
        },
        itemName: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        category: {
            type: String,
            trim: true,
            required: [true, "Category is required"],
        },

        image: {
            type: String
        },
        imagePublicId: {
            type: String
        },

        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
