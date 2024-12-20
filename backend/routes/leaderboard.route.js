import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getTopThree, getRestOfList } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/topThree", protectRoute, getTopThree);
router.get("/GetRestOfList", protectRoute, getRestOfList);

export default router