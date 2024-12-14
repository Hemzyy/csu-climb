import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, updateUser, validateUnvalidateRoute, getUserStats, getUserLeaderboardPosition } from "../controllers/user.controllers.js";


const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/update", protectRoute, updateUser); //updating username, password, pfp..
router.post("/validate/:routeId", protectRoute, validateUnvalidateRoute);
router.get("/stats/:id", protectRoute, getUserStats);
router.get("/leaderboard", protectRoute, getUserLeaderboardPosition);


export default router;