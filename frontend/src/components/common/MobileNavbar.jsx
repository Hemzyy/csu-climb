import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTrophy, FaTasks, FaHome, FaInfoCircle, FaBookmark, FaBell, FaTimes } from "react-icons/fa";
import NotificationBell from "./NotificationBell";

const MobileNavbar = ({ profileImg, logout, authUser }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="lg:hidden fixed w-full z-50">
      {/* Top Navbar */}
      <div className="navbar bg-[#252525] shadow-md">
        {/* Left Side */}
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl text-white">
            CSU Climb
          </Link>
        </div>

        {/* Right Side */}
        <div className="navbar-end">
          {/* Notifications */}
          <NotificationBell />

          {/* Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={toggleSidebar} // Open sidebar on avatar click
            >
              <div className="w-10 rounded-full">
                <img
                  src={profileImg || authUser?.profileImg || "/avatar-placeholder.png"}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={toggleSidebar} // Close sidebar on overlay click
        ></div>

        {/* Sidebar Content */}
        <div className="fixed right-0 top-0 h-full w-48 bg-[#252525] shadow-lg">
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 text-white hover:text-gray-400"
            onClick={toggleSidebar}
          >
            <FaTimes size={24} />
          </button>

          {/* Sidebar Links */}
          <div className="flex flex-col p-4 mt-12 text-center">
            <Link
              to={`/profile/${authUser?.username}`}
              className="text-white hover:text-gray-400 py-2"
              onClick={toggleSidebar} // Close sidebar on link click
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                toggleSidebar(); // Close sidebar on logout
              }}
              className="text-white hover:text-gray-400 py-2"
            >
              Se déconnecter
            </button>
            {/* Add more links/buttons here as needed */}
          </div>
        </div>
      </div>


      {/* Bottom Navbar */}
      <div className="bg-[#222222] fixed bottom-0 w-full flex justify-around py-3">
        <Link
          to="/classement"
          className={`flex flex-col items-center text-sm ${isActive("/classement") ? "text-[#FE5F55]" : "text-white hover:text-gray-400"
            }`}
        >
          <FaTrophy size={24} />
          <span className="text-xs">Classement</span>
        </Link>
        <Link
          to="/listevoies"
          className={`flex flex-col items-center text-sm ${isActive("/listevoies") ? "text-[#FE5F55]" : "text-white hover:text-gray-400"
            }`}
        >
          <FaTasks size={24} />
          <span className="text-xs">Voies</span>
        </Link>
        <Link
          to="/"
          className={`flex flex-col items-center text-sm ${isActive("/") ? "text-[#FE5F55]" : "text-white hover:text-gray-400"
            }`}
        >
          <FaHome size={24} />
          <span className="text-xs">Accueil</span>
        </Link>
        <Link
          to="/listeprojets"
          className={`flex flex-col items-center text-sm  ${isActive("/listeprojets") ? "text-[#FE5F55]" : "text-white hover:text-gray-400"
            }`}
        >
          <FaBookmark size={24} />
          <span className="text-xs">Projets</span>
        </Link>
        <Link
          to="/about"
          className={`flex flex-col items-center text-sm ${isActive("/about") ? "text-[#FE5F55]" : "text-white hover:text-gray-400"
            }`}
        >
          <FaInfoCircle size={24} />
          <span className="text-xs">À propos</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;