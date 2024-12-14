//a model is gonna be like a table, since we're using mongodb, it's gonna be a collection

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profileImg: {
            type: String,
            default: "",
        },
        leaderboardScore: {
            type: Number,
            default: 0, // Total points for leaderboard ranking
        },
        rank: {
            type: Number,
            default: null, // Rank for leaderboard
        },
        climbedRoutes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Route",
                default: [],
            }
        ],

    }, { timestamps: true } //timestamps: true will automatically add createdAt and updatedAt fields to the schema
); 

//after creating the schema, we need to create a model
const User = mongoose.model("User", userSchema); // User is the name of the model, and userSchema is the schema we created

export default User; //exporting the User model so we can use it in other files