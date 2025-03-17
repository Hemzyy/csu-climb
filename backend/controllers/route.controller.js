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

            // Remove the user from the validatedBy array in the route
            route.validatedBy = route.validatedBy.filter(
                (id) => id.toString() !== currentUser._id.toString()
            );

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

            // Add the user to the validatedBy array in the route
            route.validatedBy.push(currentUser._id);

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

export const addRemoveAsProject = async (req, res) => {
    try {
        const { routeId } = req.params;
        const currentUser = await User.findById(req.user._id); // Find the logged-in user
        const route = await Route.findById(routeId); // Find the route to add as project

        if (!currentUser || !route) {
            return res.status(404).json({ error: "User or route not found" });
        }

        // Check if the route is already added as project by the user
        const isRouteAddedAsProject = currentUser.projects.includes(routeId);

        if (isRouteAddedAsProject) {
            // Remove the route as project
            currentUser.projects = currentUser.projects.filter(
                (id) => id.toString() !== routeId
            );

            // Save changes
            await currentUser.save();
            await route.save();

            return res.status(200).json({ message: "Route removed as project successfully" });
        } else {
            // Add the route as project
            currentUser.projects.push(routeId);

            // Save changes
            await currentUser.save();
            await route.save();

            return res.status(200).json({ message: "Route added as project successfully" });
        }
    } catch (error) {
        console.log("Error in addRemoveAsProject: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const addRoute = async (req, res) => {
    try {
      const { name, grade, difficultyPoints, sector, img, thumbnail } = req.body;
  
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
  
      let thumbnailUrl = null;
      if (thumbnail) {
        const uploadedThumbnailResponse = await cloudinary.uploader.upload(thumbnail, {
          folder: "routes/thumbnails", // Optional: Store thumbnails in a separate folder
        });
        thumbnailUrl = uploadedThumbnailResponse.secure_url;
      }
  
      const newRoute = new Route({
        name,
        grade,
        difficultyPoints,
        sector,
        img: imageUrl,
        thumbnail: thumbnailUrl, // Add the thumbnail URL
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
        const routes = await Route.find().sort({createdAt: -1}); // Fetch all routes
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

        const { routeId, name, grade, difficultyPoints, sector } = req.body;
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
        route.sector = sector || route.sector;
        route.img = img || route.img;

        route = await route.save();

        return res.status(200).json({ message: "Route edited successfully", route });

    } catch (error) {
        console.log("Error in editRoute: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

//function deleteRoute that will go through every user and check if the route id passed in the request is in the user's climbedRoutes array. If it is, it will remove it from the array and decrement the user's leaderboardScore by the route's difficultyPoints. then it will save the user. After that, it will delete the route from the database
export const deleteRoute = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id); // Find the logged-in user

        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ error: "Only an Admin can delete routes." });
        }

        const { routeId } = req.params;
        const route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({ error: "Route not found" });
        }

        const users = await User.find();

        for (let user of users) {
            if (user.climbedRoutes.includes(routeId)) {
                user.climbedRoutes = user.climbedRoutes.filter(
                    (id) => id.toString() !== routeId
                );
                user.leaderboardScore -= route.difficultyPoints;
                if (user.leaderboardScore < 0) {
                    user.leaderboardScore = 0;
                }
                await user.save();
            }
        }

        if(route.img) {
            await cloudinary.uploader.destroy(route.img.split("/").pop().split(".")[0]);
        }

        if(route.thumbnail) {
            await cloudinary.uploader.destroy(route.thumbnail.split("/").pop().split(".")[0]);
        }

        // remove the route from the database
        await Route.findByIdAndDelete(routeId);

        return res.status(200).json({ message: "Route deleted successfully" });

    } catch (error) {
        console.log("Error in deleteRoute: ", error.message);
        res.status(500).json({ error: error.message });
    }
}