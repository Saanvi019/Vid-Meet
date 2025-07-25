const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://saanvis019:videocall123@cluster0.6sacmlu.mongodb.net/');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    
  }
};

module.exports = connectDB;