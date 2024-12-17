import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
//router.post("/update", protectRoute, updateUser); //updating username, password, pfp..

export default router;