import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateUnvalidateRoute, addRoute, getRoutes, getVoie, editRoute} from "../controllers/route.controller.js"

const router = express.Router();

router.get("/", getRoutes);
router.post("/validate/:routeId", protectRoute, validateUnvalidateRoute);
router.post("/addRoute", protectRoute, addRoute);
router.post('/editRoute', protectRoute, editRoute);
router.get("/voie/:id", protectRoute, getVoie);

export default router;