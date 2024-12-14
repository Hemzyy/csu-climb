import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateUnvalidateRoute, addRoute } from "../controllers/route.controller.js"

const router = express.Router();

router.post("/validate/:routeId", protectRoute, validateUnvalidateRoute);
router.post("/addRoute", protectRoute, addRoute);

export default router;