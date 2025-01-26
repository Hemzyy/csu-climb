import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:notificationId/read", protectRoute, markNotificationAsRead); 
router.delete("/:notificationId", protectRoute, deleteNotification); // Add the delete route


export default router;