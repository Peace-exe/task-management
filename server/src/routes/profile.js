const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user');
profileRouter.post("/update", userAuth,
    async (req, res) => {
        try {
            const updates = req.body;

            const ALLOWED_UPDATES = ["firstName", "lastName", "photoURL", "about", "email", "password"];
            const isUpdateAllowed = Object.keys(updates).every((update) =>
                ALLOWED_UPDATES.includes(update)
            );

            if (!isUpdateAllowed) {
                throw new Error("Invalid updates. Allowed fields: " + ALLOWED_UPDATES.join(", "));
            }

            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            const user = await User.findByIdAndUpdate(
                req.user._id,
                updates,
                { returnDocument: "after", runValidators: true }
            );

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            res.status(200).send({ message: "Profile updated successfully", data: user });

        } catch (err) {
            res.status(400).send("Error updating profile: " + err.message);
        }
    }
);

profileRouter.get("/validateToken",userAuth,
    (req,res)=>{
        res.status(200).json({
            data:req.user
        })

    }
)
module.exports=profileRouter;