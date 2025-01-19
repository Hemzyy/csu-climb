import React from "react";
import { Link } from "react-router-dom";
import { FaTrophy, FaMountain, FaTasks, FaHome, FaInfoCircle} from "react-icons/fa";

const MobileNavbar = ({ profileImg, logout, authUser }) => {
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
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src={profileImg || authUser?.profileImg || "/avatar-placeholder.png"}
                  alt="Profile"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={`/profile/${authUser?.username}`}>Profile</Link>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
        

      {/* Bottom Navbar */}
      <div className="bg-[#222222] fixed bottom-0 w-full flex justify-around py-3">
        <Link
          to="/classement"
          className="flex flex-col items-center text-white text-sm hover:text-gray-400"
        >
          <FaTrophy size={24} />
          <span className="text-xs">Classement</span>
        </Link>
        <Link
          to="/listevoies"
          className="flex flex-col items-center text-white text-sm hover:text-gray-400"
        >
          <FaMountain size={24} />
          <span className="text-xs">Voies</span>
        </Link>
        <Link
            to="/" className="flex flex-col items-center text-white text-sm hover:text-gray-400"
        >
            <FaHome size={24} />
            <span className="text-xs">Accueil</span>
        </Link>
        <Link
          to="/listeprojets"
          className="flex flex-col items-center text-white text-sm hover:text-gray-400"
        >
          <FaTasks size={24} />
          <span className="text-xs">Projets</span>
        </Link>
        <Link
          to="/about"
          className="flex flex-col items-center text-white text-sm hover:text-gray-400"
          >
            <FaInfoCircle size={24} />
            <span className="text-xs">À propos</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;