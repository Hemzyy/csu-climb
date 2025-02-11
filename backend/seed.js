import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "./models/route.model.js"; // Assuming you have a Route model

dotenv.config(); // Load environment variables

const seedData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Fetch all routes
        const routes = await Route.find(); 

        // Loop through each route and add the 'sector' field if it doesn't exist
        for (let route of routes) {
            if (route.sector === undefined) {
                // Add sector field
                route.sector = "temp";
                await route.save();
                console.log(`Route ${route.name} updated with sector field`);
            }
        }

        console.log("All routes updated with sector field");

        process.exit(); // Exit script
    } catch (error) {
        console.error("Error seeding data:", error.message);
        process.exit(1); // Exit with failure
    }
};

seedData();
