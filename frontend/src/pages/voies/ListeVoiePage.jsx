import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import AddRouteModal from "./AddRouteModal";
import EditRouteModal from "./EditRouteModal";
import useValidate from "../../hooks/useValidate";
import RouteCardModal from "./RouteCardModal";

const VoiePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const isAdmin = authUser?.isAdmin;

  const { data: routes, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await fetch("/api/routes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  // State for selected route and modal visibility
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [tempImg, setTempImg] = useState(null);
  const imgInputRef = useRef(null);

  // Validate Route Mutation
  const validateRouteMutation = useValidate();

  const handleValidate = (routeId) => {
    validateRouteMutation.mutate(routeId);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTempImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setTempImg(null);
  };

  return (
    <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen pt-16 text-white gap-4">
      {/* Page Header */}
      <div className="text-white text-2xl font-bold mt-10 text-center">
        Explore Climbing Routes
      </div>

      {/* Routes Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 sm:mx-0 mx-24">
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
              <div
                key={route._id}
                className="bg-[#FE5F55] rounded-lg shadow-md overflow-hidden relative hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setSelectedRoute(route)} // Open modal on click
              >
                <div className="w-full sm:h-32 h-72 bg-gray-400 flex items-center justify-center">
                  <img
                    src={route.img || "/route-img-placeholder.png"}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-black flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{route.name}</h2>
                    <p className="text-sm text-black mt-2">
                      <strong>Grade:</strong> {route.grade}
                    </p>
                    <p className="text-sm text-black">
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
            );
          })
        ) : (
          <div className="text-white text-center col-span-full">
            No routes available
          </div>
        )}
      </div>

      {/* Route Details Modal */}
      <RouteCardModal
        selectedRoute={selectedRoute}
        closeModal={closeModal}
        isAdmin={isAdmin}
        tempImg={tempImg}
        imgInputRef={imgInputRef}
        handleImageChange={handleImageChange}
        handleValidate={handleValidate}
        validateRouteMutation={validateRouteMutation}
        authUser={authUser}
      />

    </div>
  );
};

export default VoiePage;
