const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Bhai, .env file mein MONGO_URI nahi mil raha!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Bhai, MongoDB Atlas connect ho gaya: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error hai bhai: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;