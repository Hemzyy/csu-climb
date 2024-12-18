import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateUnvalidateRoute, addRoute, getRoutes } from "../controllers/route.controller.js"

const router = express.Router();

router.get("/", getRoutes);
router.post("/validate/:routeId", protectRoute, validateUnvalidateRoute);
router.post("/addRoute", protectRoute, addRoute);

export default router;