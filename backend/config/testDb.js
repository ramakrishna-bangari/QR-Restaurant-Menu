require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.log('MongoDB Error:', err));