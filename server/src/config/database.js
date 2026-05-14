const mongoose = require('mongoose');
require("dotenv").config();

URI = process.env.MONGODB_URI;


const connectDB = async () => {
    await mongoose.connect(URI, {
  serverSelectionTimeoutMS: 30000
});
};

module.exports=connectDB;





    