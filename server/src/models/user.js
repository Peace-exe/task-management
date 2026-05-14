const mongoose=require('mongoose');
const validator= require('validator');
const bcrypt=require('bcrypt');
const jwt= require("jsonwebtoken");
const JWT_PRIVATE_KEY="@AbyMTech$730";

const userSchema = new mongoose.Schema({ 
    firstName:{
        type:String,
        required:true,
        minLength:1,
        maxLenght:50

    },
    lastName:{
        type:String,
        required:true,
        minLength:1,
        maxLenght:50
    },
    email:{
        type:String,
        required:true,
        minLength:1,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format: "+value);
            }
        }
    },
    
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password."+
                    "Password must contain minimum 8 characters,1 lowercase ,1 uppercase and 1 special character");
            }
        }
    },
    
    
    photoURL:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid URL: "+value);
            }
        }
    },
    about:{
        type:String,
        default:"this is a default user about"
    },
    

},
{
    timestamps:true
}
);

userSchema.methods.getJWT= async function(){

    const user=this;
    const token = await jwt.sign({_id:user._id}, JWT_PRIVATE_KEY, {
        expiresIn:"1d"
    });

    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user= this;
    const passwordHash= user.password;
   const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHash);
   return isPasswordValid;
}

const User = mongoose.model("User",userSchema);


module.exports=User;