import { v2 as cloudinary } from "cloudinary";

import Route from "../models/route.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

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

export const addRoute = async (req, res) => {
	try {
		const { name, grade, difficultyPoints, setter, img } = req.body;

		const currentUser = await User.findById(req.user._id);
		if (!currentUser || !currentUser.isAdmin) {
			return res.status(403).json({ error: "Only an Admin can add routes." });
		}

		if (!grade || !difficultyPoints) {
			return res.status(400).json({ error: "Grade and difficulty points are required" });
		}

		let imageUrl = null;
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img, {
				folder: "routes",
			});
			imageUrl = uploadedResponse.secure_url;
		}

		const newRoute = new Route({
			name,
			grade,
			difficultyPoints,
			setter,
			img: imageUrl,
		});

		await newRoute.save();

		const newNotification = new Notification({
			routeId: newRoute._id,
			routeName: newRoute.name,
			grade: newRoute.grade,
			type: "newRoute",
		});

		await newNotification.save();

		return res.status(201).json({ message: "Route added successfully", route: newRoute });
	} catch (error) {
		console.log("Error in addRoute: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find(); // Fetch all routes
        res.status(200).json(routes);
    } catch (error) {
        console.error("Error fetching routes:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getVoie = async (req, res) => {
    try {
        const { id } = req.params;
        const voie = await Route.findById(id);
        if (!voie) {
            return res.status(404).json({ error: "Voie not found" });
        }
        res.status(200).json(voie);
    } catch (error) {
        console.error("Error fetching voie:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const editRoute = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id); // Find the logged-in user

        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ error: "Only an Admin can edit routes." });
        }

        const { routeId, name, grade, difficultyPoints, setter } = req.body;
        let { img } = req.body;

        let route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({ error: "Route not found" });
        }

        if (!name || !grade || !difficultyPoints) {
            return res.status(400).json({ error: "Name, grade, and difficulty points are required" });
        }

        if (img){
            if(route.img) {
                await cloudinary.uploader.destroy(route.img.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        } 

        route.name = name || route.name;
        route.grade = grade || route.grade;
        route.difficultyPoints = difficultyPoints || route.difficultyPoints;
        route.setter = setter || route.setter;
        route.img = img || route.img;

        route = await route.save();

        return res.status(200).json({ message: "Route edited successfully", route });

    } catch (error) {
        console.log("Error in editRoute: ", error.message);
        res.status(500).json({ error: error.message });
    }
}