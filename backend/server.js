const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoute");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.use("/api/user", authRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes)

const cron = require("node-cron");
const Order = require("./models/Order");
cron.schedule("0 0 * * *", async () => {
    try {
        const result = await Order.deleteMany({ status: "Completed" });
        console.log(`Auto-deleted ${result.deletedCount} completed orders`);
    } catch (error) {
        console.log("Auto-delete failed:", error);
    }
});
