const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password", });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists", });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "Registration successful", });
    } catch (error) {
        res.status(500).json({ message: error.message, });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password", });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password", });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password", });
        }
        const userid = user._id;
        const restaurant = await Restaurant.findOne({ ownerId: user._id });
        const token = generateToken(userid);
        res.status(200).json({
            message: "Login successful", token, userid,
            restaurantName: restaurant ? restaurant.restaurantName :" "
        });


    } catch (error) {
        res.status(500).json({ message: error.message, });
    }
};

module.exports = {
    register,
    login
};