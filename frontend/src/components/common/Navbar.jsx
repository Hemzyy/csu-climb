import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // If you're using React Router

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const profileImg = authUser?.profileImg;

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return (
    <div className="navbar bg-[#252525] fixed w-full mx-auto z-50 shadow-md">

        {/* Responsive Menu */}
      <div className="navbar-center lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/classement">Classement</Link>
            </li>
            <li>
              <Link to="/listevoies">Voies</Link>
            </li>
            <li>
              <Link to="/listeprojets">Mes Projets</Link>
            </li>
            <li>
              <Link to="/about">À propos</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Navbar Start */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          CSU Climb
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
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

      

      {/* Navbar End */}
      <div className="navbar-end flex gap-2">
        {/* Notification Icon */}
        {/* <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button> */}

        {/* Profile Dropdown */}
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

export default Navbar;
