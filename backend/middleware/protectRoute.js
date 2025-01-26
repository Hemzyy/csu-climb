import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; //we fet the token from the cookies 
        if(!token){
            return res.status(401).json({error: "Unauthroized: No Token Provided"});
        }

        //if there is a cookie but is invalid (we check this with the secret that we used to sign the token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){ //if user tries to manipulate the token
            return res.status(401).json({error: "Unauthorized: Invalid Token"});
        }

        //valid token, find user in db and add it into the request object 
        const user = await User.findById(decoded.userId).select("-password"); //we dont return the password

        //just in case
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("error in protectRoute middleware", err.message);
        res.status(500).json({error: "Internal server error"});
    }
};