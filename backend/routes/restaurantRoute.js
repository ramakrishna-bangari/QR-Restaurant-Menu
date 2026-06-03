const express = require("express");
const router = express.Router();
const { createRestaurant, getMyRestaurant, updateRestaurant, deleteRestaurant, upload } = require("../controllers/restaurantController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-restaurant", authMiddleware, upload.single("logo"), createRestaurant);
router.get("/get-myrestaurant", authMiddleware, getMyRestaurant);
router.put("/update-restaurant/:restaurantId", authMiddleware, upload.single("logo"),updateRestaurant);
router.delete("/delete-restaurant/:restaurantId", authMiddleware, deleteRestaurant);

module.exports = router;
