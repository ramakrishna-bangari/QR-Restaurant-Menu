const express = require("express");
const router = express.Router();
const { createMenuItem, getMenu, updateMenuItem, deleteMenuItem, getCustomerMenu, upload, } = require("../controllers/menuController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-menu", authMiddleware, upload.single("image"), createMenuItem);
router.get("/get-menu", authMiddleware, getMenu);
router.put("/update-menu/:id", authMiddleware, upload.single("image"), updateMenuItem);
router.delete("/delete-menu/:id", authMiddleware, deleteMenuItem);
router.get("/customer-menu/:restaurantId", getCustomerMenu);
module.exports = router;
