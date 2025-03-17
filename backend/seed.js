import mongoose from "mongoose";
import dotenv from "dotenv";
import Route from "./models/route.model.js"; // Import the Route model

dotenv.config(); // Load environment variables

const seedData = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Fetch all routes
    const routes = await Route.find();

    // Loop through each route and add the 'thumbnail' field if it doesn't exist
    for (let route of routes) {
      if (!route.thumbnail) {
        // Add thumbnail field with a default value (or leave it as null)
        route.thumbnail = null; // You can set a default thumbnail URL here if needed
        await route.save();
        console.log(`Route ${route.name} updated with thumbnail field`);
      }
    }

    console.log("All routes updated with thumbnail field");

    process.exit(); // Exit script
  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1); // Exit with failure
  }
};

seedData();