const JWT_PRIVATE_KEY="@AbyMTech$730";
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth= async (req,res,next)=>{
    try {

        
       
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("User not authorised. Please login.");
        }

       
        const payload= await jwt.verify(token , JWT_PRIVATE_KEY);
        const {_id} = payload;

        
        const userData= await User.findById(_id);
        if(!userData){
            throw new Error("user does not exist.");
        }

        req.user= userData; 
        next();



    } catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }
}

module.exports={
    userAuth
};