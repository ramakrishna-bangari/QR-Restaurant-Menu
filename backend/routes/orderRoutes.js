const express = require("express");
const router = express.Router();
const { placeOrder, getOrdersByRestaurant, updateOrderStatus,getCustomerOrderStatus , deleteOrder} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/place-order", placeOrder);    // public (customers place orders)
router.get("/get-order", authMiddleware, getOrdersByRestaurant);
router.put("/update-order/:id", authMiddleware, updateOrderStatus);
router.get("/customer-order/:orderId", getCustomerOrderStatus);
router.delete("/delete-order/:id", authMiddleware, deleteOrder); 
module.exports = router;
