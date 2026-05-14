const express = require("express");
const server = express();
const connectDB= require("./src/config/database");
const cookieParser=require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT;
server.use(cors({
    origin: "http://localhost:5173", 
  credentials: true
}));
server.use(express.json());
server.use(cookieParser());

const authRouter = require('./src/routes/auth');
const taskRouter = require('./src/routes/task');
const profileRouter = require('./src/routes/profile');

server.use("/auth",authRouter);
server.use("/task",taskRouter);
server.use("/profile",profileRouter);

connectDB()
    .then(()=>{
        console.log("DB connection was establised.");
        server.listen(PORT,()=>{
            console.log(`server is running on port:${PORT}`);
        });
    })
    .catch((err)=>{
        console.error(`couldn't connect to the database :( :\n ${err.message}`);
    });