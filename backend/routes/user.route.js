import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, getClimbedRoutes, updateUser} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/climbedRoutes/:username", protectRoute, getClimbedRoutes);
router.post("/update", protectRoute, updateUser); //updating username, password, pfp..

export default router;