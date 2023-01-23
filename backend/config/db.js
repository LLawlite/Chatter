const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // This is to get rid of DeprecationWarning
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline);
    process.exit();
  }
};
module.exports = connectDB;
