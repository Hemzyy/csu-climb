import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

//models
import User from "../models/user.model.js";
import Route from "../models/route.model.js";

export const getUserProfile = async (req, res) => {
    const {username} = req.params; 

    try {
        const user = await User.findOne({username}).select("-password -email");

        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json(user); //send the user data

    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({error:error.message});
    }
};

//placeholder for rest of the functions
export const updateUser = async (req, res) => {
    res.send("updateUser");
}

export const validateUnvalidateRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const currentUser = await User.findById(req.user._id); // Find the logged-in user
        const route = await Route.findById(routeId); // Find the route to validate

        if (!currentUser || !route) {
            return res.status(404).json({ error: "User or route not found" });
        }

        // Check if the route is already validated by the user
        const isRouteValidated = currentUser.climbedRoutes.includes(routeId);

        if (isRouteValidated) {
            // Unvalidate the route
            currentUser.climbedRoutes = currentUser.climbedRoutes.filter(
                (id) => id.toString() !== routeId
            );
            currentUser.leaderboardScore -= route.difficultyPoints; // Adjust point removal logic here if needed
            //if points go below 0, set to 0
            if (currentUser.leaderboardScore < 0) {
                currentUser.leaderboardScore = 0;
            }
            route.successfulClimbs -= 1;

            // Save changes
            await currentUser.save();
            await route.save();

            // Update ranks after removing points
            await updateRanks();

            return res.status(200).json({ message: "Route unvalidated successfully" });
        } else {
            // Validate the route
            currentUser.climbedRoutes.push(routeId);
            //add route's difficultyPoints to the user's leaderboardScore
            currentUser.leaderboardScore += route.difficultyPoints;
            route.successfulClimbs += 1;

            // Save changes
            await currentUser.save();
            await route.save();

            // Update ranks after adding points
            await updateRanks();

            return res.status(200).json({ message: "Route validated successfully" });
        }
    } catch (error) {
        console.log("Error in validateUnvalidateRoute: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
const updateRanks = async () => {
    const users = await User.find().sort({ leaderboardScore: -1, updatedAt: 1 });

    let rank = 1;
    for (let user of users) {
        user.rank = rank++;
        await user.save();
    }
};


export const getUserStats = async (req, res) => {
    res.send("getUserStats");
}

export const getUserLeaderboardPosition = async (req, res) => {
    res.send("getUserLeaderboardPosition");
}

