import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Route from "./models/route.model.js";

dotenv.config(); // Load environment variables

const seedData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        //await Route.deleteMany({});

        // Create dummy users
        // const users = await User.insertMany([
        //     { username: "johndoe", password: "123456", email: "johndoe@email.com", leaderboardScore: 0, climbedRoutes: [] },
        //     { username: "janedoe", password: "123456", email: "janedoe@email.com", leaderboardScore: 0, climbedRoutes: [] },
        // ]);
        // console.log("Users seeded:", users);

        // Create dummy routes
        // const routes = await Route.insertMany([
        //     { name: "Easy Boulder", grade: "5c", difficultyPoints: 50, successfulClimbs: 0 },
        //     { name: "Advanced Wall", grade: "7a", difficultyPoints: 100, successfulClimbs: 0 },
        // ]);
        console.log("users deleted");

        process.exit(); // Exit script
    } catch (error) {
        console.error("Error seeding data:", error.message);
        process.exit(1); // Exit with failure
    }
};

seedData();
