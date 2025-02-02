import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const notificationRef = useRef(null); // Ref for the notifications window

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isAdmin = authUser?.isAdmin;

  // Fetch all notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  // Mark a notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId) => {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    },
    onSuccess: () => {
      // Refetch notifications after marking as read
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Delete a notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId) => {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete notification");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error deleting notification:", error.message);
      alert(error.message);
    },
  });

  // Close the notifications window when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !event.target.closest("button") // Ensure the bell button doesn't close the window
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-gray-400 focus:outline-none"
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={notificationRef} // Attach the ref to the notifications window
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50"
        >
          <div className="p-4">
            <h3 className="font-bold mb-2">Notifications</h3>
            <div className="max-h-64 overflow-y-auto">
              {" "}
              {/* Add scrollable container */}
              {isLoading ? (
                <p>Loading...</p>
              ) : notifications?.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-2 hover:bg-gray-100 ${
                      notification.isRead ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">
                          Une nouvelle voie {notification.grade} a été ajoutée:{" "}
                          {notification.routeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead.mutate(notification._id)}
                            className="p-1 text-green-500 hover:text-green-600 focus:outline-none"
                          >
                            <FaCheck size={16} />
                          </button>
                        )}
                        {isAdmin && ( // Only show delete button for admins
                          <button
                            onClick={() =>
                              deleteNotification.mutate(notification._id)
                            }
                            className="p-1 text-red-500 hover:text-red-600 focus:outline-none"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Pas de nouvelles notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;