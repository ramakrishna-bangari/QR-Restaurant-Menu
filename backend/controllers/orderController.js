const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// POST /api/orders  (public — customers place orders)
const placeOrder = async (req, res) => {
    try {
        const { restaurantId, customerName, tableNumber, items, note } = req.body;

        if (!restaurantId || !customerName || !items || items.length === 0) {
            return res.status(400).json({ message: "restaurantId, customerName, and items are required." });
        }

        // Verify restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        // Validate items and calculate total
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item ${item.menuItemId} not found.` });
            }
            if (!menuItem.available) {
                return res.status(400).json({ message: `${menuItem.itemName} is currently unavailable.` });
            }
            if (menuItem.restaurantId.toString() !== restaurantId) {
                return res.status(400).json({ message: "Menu item does not belong to this restaurant." });
            }

            const quantity = item.quantity || 1;
            totalAmount += menuItem.price * quantity;

            validatedItems.push({
                menuItemId: menuItem._id,
                name: menuItem.itemName,
                price: menuItem.price,
                quantity,
            });
        }

        const order = await Order.create({
            restaurantId,
            customerName,
            tableNumber: tableNumber || "N/A",
            items: validatedItems,
            totalAmount,
            note: note || "",
        });

        res.status(201).json({ message: "Order placed successfully.", order });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// GET /api/orders (owner only)
const getOrdersByRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ ownerId: req.user._id });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        const orders = await Order.find({
            restaurantId: restaurant._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            orders,
            total: orders.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error.message
        });
    }
};

// PUT /api/orders/:id  (owner updates order status)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        const restaurant = await Restaurant.findById(order.restaurantId);
        if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized." });
        }

        const { status } = req.body;
        const validStatuses = ["Pending", "Preparing", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated.", order });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const getCustomerOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        if (order.status !== "Completed") {
            return res.status(400).json({ message: "Only completed orders can be deleted" });
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { placeOrder, getOrdersByRestaurant, updateOrderStatus, getCustomerOrderStatus, deleteOrder };
