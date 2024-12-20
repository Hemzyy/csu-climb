import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import AddRouteModal from "./addRouteModal";

const VoiePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isAdmin = authUser?.isAdmin;
  console.log("isAdmin", isAdmin);

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

        {/* if isAdmin, show a button to add a new route that is the same size*/}
        {isAdmin && <AddRouteModal />}

        {/* if isLoading, show a loading message */}
        {isLoading ? (
          <p className="text-white text-center col-span-full">Loading...</p>
        ) : routes && routes.length > 0 ? (
          routes.map((route) => (
            <Link to={`/voie/${route._id}`} key={route._id}>
              <div className="bg-[#2E4259] rounded-lg shadow-md overflow-hidden">
                <div className="w-full h-32 bg-gray-400 flex items-center justify-center">
                  <span className="text-white text-sm">Image Placeholder</span>
                </div>
                <div className="p-4 text-white">
                  <h2 className="text-lg font-bold">{route.name}</h2>
                  <p className="text-sm text-gray-400 mt-2">
                    <strong>Grade:</strong> {route.grade}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Points:</strong> {route.difficultyPoints}
                  </p>
                </div>
              </div>
            </Link>
          ))
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
