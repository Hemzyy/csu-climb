import React from "react";
import { Link } from "react-router-dom";

const DesktopNavbar = ({ profileImg, logout, authUser }) => {
  return (
    <div className="navbar hidden lg:flex bg-[#252525] fixed w-full mx-auto z-50 shadow-md">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          CSU Climb
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1 space-x-40">
          <li>
            <Link to="/classement" className="btn btn-sm btn-ghost">
              Classement
            </Link>
          </li>
          <li>
            <Link to="/listevoies" className="btn btn-sm btn-ghost">
              Voies
            </Link>
          </li>
          <li>
            <Link to="/listeprojets" className="btn btn-sm btn-ghost">
              Mes Projets
            </Link>
          </li>
          <li>
            <Link to="/about" className="btn btn-sm btn-ghost">
              À propos
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-2">
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
              <Link
                to={`/profile/${authUser?.username}`}
                >
                Profile
              </Link>
            </li>
            <li>
              <a onClick={() => logout()}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;