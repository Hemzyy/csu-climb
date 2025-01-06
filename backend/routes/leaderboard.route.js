import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getTopThree, getRestOfList, toggleVisibility } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/topThree", protectRoute, getTopThree);
router.get("/GetRestOfList", protectRoute, getRestOfList);
//toggle visibility of the leaderboard
router.patch("/leaderboard-visibility/:id", protectRoute, toggleVisibility);

export default router