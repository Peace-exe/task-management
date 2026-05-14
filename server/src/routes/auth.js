const express = require("express");
const {validateSignUpData}= require('../utils/helperValidator');
const bcrypt= require('bcrypt');
const User = require("../models/user");
const validator= require('validator');

const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{ 

    

    
    

    try{
        
        validateSignUpData(req);
        const {firstName,lastName,email,password}=req.body;

        
        const passwordHash= await bcrypt.hash(password,10);

        
        const user = new User({
            firstName,
            lastName,
            email,
            password:passwordHash

        });
        const newUserData= await user.save(); 
        const userObj = newUserData.toObject();
        delete userObj.password;
        
        res.status(201).json({
            message:"data saved successfully",
            data:userObj
        });
    }catch(err){
        res.status(400).send("error occured while saving to DB.\n ERROR: "+ err.message);
    }
    

});

authRouter.post("/login",
    async (req,res)=>{

        try{
            
            const {email,password}= req.body;

            if(!validator.isEmail(email)){
                throw new Error("Invalid Credentials");
            }
            else{
                const userData = await User.findOne({email:email}); //logged in user
                
                if(!userData){
                    throw new Error("Invalid Credentials");
                }

                const isPasswordValid = await userData.validatePassword(password);

                if(!isPasswordValid){
                    throw new Error("Invalid credentials");
                }
                else{
                    //create a jwt token 
                    const token= await userData.getJWT();

                    res.cookie("token",token, {
                        expires:new Date(Date.now()+24*3600000)
                    });

                    res.status(201).json({
                        "message":"login successfull",
                        "data":userData
                    });
                    
                    
                    
                }

                /*
                bcrypt.compare(password, userData.password, async (err, result)=> {
                    if(!result){
                        throw new Error("Invalid credentials");
                    }
                    else{
                        //create a jwt token 
                        const token= await userData.getJWT();

                        res.cookie("token",token, {
                            expires:new Date(Date.now()+24*3600000)
                        });
                        res.send("login successful.");
                        console.log(res);
                    }
                });
                */
            }
        }catch(err){
            res.status(400).send("Invalid Credentials");
        }
        

});

authRouter.post("/logout",
    (req,res)=>{
        res
        .cookie("token",null,{
            expires:new Date(Date.now())
        })
        .send("logout successful");
    }
)

module.exports=authRouter;
