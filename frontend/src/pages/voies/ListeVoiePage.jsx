import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

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

  // State for filters and sorting
  const [filterGrade, setFilterGrade] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortField, setSortField] = useState("difficultyPoints"); // Default sorting by points

  // Filter and sort logic
  const filteredAndSortedRoutes = routes
    ?.filter((route) => (filterGrade ? route.grade === filterGrade : true))
    ?.sort((a, b) => {
      const comparison =
        sortField === "difficultyPoints"
          ? a.difficultyPoints - b.difficultyPoints
          : a.grade.localeCompare(b.grade);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleFilterChange = (e) => {
    setFilterGrade(e.target.value);
  };

  const handleSortChange = (field) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const closeModal = () => {
    setSelectedRoute(null);
    setTempImg(null);
  };

  return (
    <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white mt-4 gap-5">

      <h1 className="text-3xl font-bold text-center">List des voies</h1>

      {/* Filters and Sorting */}
      <div className="flex justify-between  items-center">
        <div>
          <button
            onClick={() => handleSortChange("difficultyPoints")}
            className="bg-gray-700 text-white rounded px-2 py-1 mx-2"
          >
            Sort by Points ({sortOrder === "asc" ? "↑" : "↓"})
          </button>
          <button
            onClick={() => handleSortChange("grade")}
            className="bg-gray-700 text-white rounded px-2 py-1"
          >
            Sort by Grade ({sortOrder === "asc" ? "↑" : "↓"})
          </button>
        </div>
      </div>

      {/* Routes Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:mx-0 mx-20 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
        {/* Admin Add Route Button */}
        {isAdmin && <AddRouteModal />}

        {/* Routes */}
        {isLoading ? (
          <p className="text-white text-center col-span-full">Loading...</p>
        ) : filteredAndSortedRoutes && filteredAndSortedRoutes.length > 0 ? (
          filteredAndSortedRoutes.map((route) => {
            const isValidated = authUser?.climbedRoutes.some(
              (climbedRoute) => climbedRoute._id === route._id
            );
            return (
              <div
                key={route._id}
                className="bg-[#808080] rounded-lg shadow-md overflow-hidden relative hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setSelectedRoute(route)} // Open modal on click
              >
                <div className="w-full sm:h-44 h-72 bg-gray-400 flex items-center justify-center">
                  <img
                    src={route.img || "/route-img-placeholder.png"}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 pb-2 text-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{route.name}</h2>
                    <p className="text-sm text-gray-200">
                      <strong>Grade:</strong> {route.grade}
                    </p>
                    <p className="text-sm text-gray-200">
                      <strong>Points:</strong> {route.difficultyPoints}
                    </p>
                  </div>
                  {isValidated && (
                    <div className="text-green-400">
                      <img src="/icons/check.png" alt="check" className="w-8 h-8" />
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
      {selectedRoute && (
        <RouteCardModal
          selectedRoute={selectedRoute}
          closeModal={closeModal}
          isAdmin={isAdmin}
          tempImg={tempImg}
          imgInputRef={imgInputRef}
          handleValidate={handleValidate}
          validateRouteMutation={validateRouteMutation}
          authUser={authUser}
        />
      )}
    </div>
  );
};

export default VoiePage;
