import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config(); // Load environment variables

const seedData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Fetch all users
        const users = await User.find(); 

        // Loop through each user and add the new fields if they don't exist
        for (let user of users) {
            // Check if resetToken or resetTokenExpire are missing
            if (user.resetToken === undefined || user.resetTokenExpire === undefined) {
                // Add the resetToken and resetTokenExpire fields with null values
                user.resetToken = null;
                user.resetTokenExpire = null;

                await user.save(); // Save the updated user
                console.log(`Updated user ${user.username} with null resetToken and resetTokenExpire`);
            }
        }

        console.log("All users updated with resetToken and resetTokenExpire fields set to null");

        process.exit(); // Exit script
    } catch (error) {
        console.error("Error seeding data:", error.message);
        process.exit(1); // Exit with failure
    }
};

seedData();
