import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

//models
import User from "../models/user.model.js";

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

export const getUserdetails = async (req, res) => {
	const { id } = req.params;

	try {
		const
			user = await
			User.findById(id).select("-password -email");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(user); //send the user data

	} catch (error) {
		console.log("Error in getUserdetails: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getClimbedRoutes = async (req, res) => {
    try {
        const { username } = req.params;

        // Use findOne with an object to filter by username
        const user = await User.findOne({ username }).populate("climbedRoutes");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Group climbed routes by grade
        const groupedRoutes = user.climbedRoutes.reduce((acc, route) => {
            acc[route.grade] = (acc[route.grade] || 0) + 1;
            return acc;
        }, {});

        // Format the result
        const result = {
            //totalRoutes: user.climbedRoutes.length,
            grades: Object.entries(groupedRoutes).map(([grade, count]) => ({ grade, count })),
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getClimbedRoutes:", error.message, error.stack);
        res.status(500).json({ message: "An error occurred while fetching climbed routes" });
    }
};


export const updateUser = async (req, res) => {
	const { email, username, currentPassword, newPassword } = req.body;
	let { profileImg} = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		user.email = email || user.email;
		user.username = username || user.username;
		user.profileImg = profileImg || user.profileImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};