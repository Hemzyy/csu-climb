import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import AddRouteModal from "./addRouteModal";

const VoiePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isAdmin = authUser?.isAdmin;

  const { data: routes, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/routes");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col items-center w-screen min-h-screen bg-[#1D232A] pt-16">
      {/* Page Header */}
      <div className="text-white text-2xl font-bold mt-10">
        Explore Climbing Routes
      </div>

      {/* Routes Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-[90%]">
        {/* Admin Add Route Button */}
        {isAdmin && <AddRouteModal />}

        {/* Routes */}
        {isLoading ? (
          <p className="text-white text-center col-span-full">Loading...</p>
        ) : routes && routes.length > 0 ? (
          routes.map((route) => {
            const isValidated = authUser?.climbedRoutes.some(
              (climbedRoute) => climbedRoute._id === route._id
            );
            return (
              <Link to={`/voie/${route._id}`} key={route._id}>
                <div className="bg-[#2E4259] rounded-lg shadow-md overflow-hidden relative hover:opacity-80 transition-opacity">
                  <div className="w-full h-32 bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-sm">Image Placeholder</span>
                  </div>
                  <div className="p-4 text-white flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">{route.name}</h2>
                      <p className="text-sm text-gray-400 mt-2">
                        <strong>Grade:</strong> {route.grade}
                      </p>
                      <p className="text-sm text-gray-400">
                        <strong>Points:</strong> {route.difficultyPoints}
                      </p>
                    </div>
                    {isValidated && (
                      <div className="text-green-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-white text-center col-span-full">
            No routes available
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiePage;
