import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/createFeedback", protectRoute, createFeedback);

export default router;