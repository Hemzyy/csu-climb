import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";


export const getNotifications = async (req, res) => {
    try {
      const userId = req.user._id;
      const notifications = await Notification.find().sort({ createdAt: -1 });
  
      // Add a `isRead` field to each notification for the current user
      const notificationsWithReadStatus = notifications.map((notification) => ({
        ...notification.toObject(),
        isRead: notification.readBy.includes(userId),
      }));
  
      res.status(200).json(notificationsWithReadStatus);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// notification.controller.js
export const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id; // Ensure `req.user` is populated by `protectRoute`
  
      // Add the user's ID to the `readBy` array
      await Notification.findByIdAndUpdate(notificationId, {
        $addToSet: { readBy: userId },
      });
  
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;
  
      // Check if the user is an admin
      const user = await User.findById(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }
  
      // Find and delete the notification
      const notification = await Notification.findByIdAndDelete(notificationId);
  
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.log("Error in deleteNotification:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
};