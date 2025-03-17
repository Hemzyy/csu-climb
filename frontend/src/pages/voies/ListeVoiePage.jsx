import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import AddRouteModal from "./AddRouteModal";
import EditRouteModal from "./EditRouteModal";
import useValidate from "../../hooks/useValidate";
import useAddAsProject from "../../hooks/useAddAsProject";
import RouteCardModal from "./RouteCardModal";

import WallMap from "../../components/common/WallMap";

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

  // State for selected tab (validated or unvalidated)
  const [selectedTab, setSelectedTab] = useState("unvalidated");

  // Calculate the number of validated routes and total routes
  const validatedRoutesCount = authUser?.climbedRoutes?.length || 0;
  const totalRoutesCount = routes?.length || 0;

  // for auto scrolling
  const routesListRef = useRef(null);

  // Validate Route Mutation
  const validateRouteMutation = useValidate();

  const handleValidate = (routeId) => {
    validateRouteMutation.mutate(routeId);
  };

  // Add as Project Mutation
  const addAsProjectMutation = useAddAsProject();

  const handleAddAsProject = (routeId) => {
    addAsProjectMutation.mutate(routeId);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTempImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // State for selected route and modal visibility
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [tempImg, setTempImg] = useState(null);
  const imgInputRef = useRef(null);

  // State for filters and sorting
  const [filterGrade, setFilterGrade] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortField, setSortField] = useState("difficultyPoints"); // Default sorting by points

  // State for selected sector  
  const [selectedSector, setSelectedSector] = useState(null);

  const handleSectorClick = (sector) => {
    setSelectedSector((prevSector) => (prevSector === sector ? null : sector));

    // Scroll to the routes list after a short delay
    setTimeout(() => {
      if (routesListRef.current) {
        routesListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // Filter and sort logic
  const filteredAndSortedRoutes = routes
    ?.filter((route) =>
      (!selectedSector || route.sector === selectedSector) && // Filter by sector
      (filterGrade ? route.grade === filterGrade : true) // Existing grade filter
    )
    ?.sort((a, b) => {
      let comparison;
      if (sortField === "difficultyPoints") {
        comparison = a.difficultyPoints - b.difficultyPoints;
      } else if (sortField === "grade") {
        comparison = a.grade.localeCompare(b.grade);
      } else if (sortField === "createdAt") {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Apply validated/unvalidated filtering
  const finalFilteredRoutes = filteredAndSortedRoutes?.filter((route) => {
    const isRouteValidated = authUser?.climbedRoutes.some(
      (climbedRoute) => climbedRoute._id === route._id
    );
    return selectedTab === "validated" ? isRouteValidated : !isRouteValidated;
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

  // Fetch user details by ID
  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`); // Adjust endpoint as needed
      const user = await res.json();
      if (!res.ok) throw new Error(user.error || "Error fetching user");
      return user;
    } catch (error) {
      console.error(`Failed to fetch user details for ${userId}:`, error);
      return null; // Fallback to prevent crashes
    }
  };

  // Mapping of sector codes to names
  const sectorNames = {
    G: "Secteur Gauche",
    C: "Secteur Central",
    D: "Secteur Droite",
  };

  return (
    <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-5 pt-[5rem] sm:pb-0 pb-20">

      <h1 className="text-3xl font-bold text-center">Liste des voies</h1>

      <p className="text-center text-gray-400 mt-1">
        Cliquez sur un secteur pour filtrer les voies disponibles.
      </p>

      {/* Interactive Wall Map */}
      <WallMap onSectorClick={handleSectorClick} selectedSector={selectedSector} />

      {/* Filters and Sorting */}
      <div ref={routesListRef} className="flex flex-wrap justify-center gap-2 p-2 sm:justify-between sm:flex-nowrap">
        <button
          onClick={() => handleSortChange("difficultyPoints")}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          Trier par points ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
        <button
          onClick={() => handleSortChange("grade")}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          Trier par niveau ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
        <button
          onClick={() => handleSortChange("createdAt")}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          Trier par date ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
      </div>

      {/* Selected Sector Message */}
      <div className="text-center text-white mt-2">
        {selectedSector ? (
          <p className="text-lg">
            Secteur sélectionné : <span className="font-bold">{sectorNames[selectedSector]}</span>
            <button
              onClick={() => setSelectedSector(null)}
              className="ml-2 text-red-500 underline hover:text-red-300"
            >
              Réinitialiser
            </button>
          </p>
        ) : (
          <p className="text-lg text-gray-400">Aucun secteur sélectionné</p>
        )}
      </div>

      {/* Routes Container */}
      <div className="bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
        {/* Validated Routes Count and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <p className="text-lg text-white mb-4 sm:mb-0">
            Vous avez validé <span className="font-bold">{validatedRoutesCount}</span> sur <span className="font-bold">{totalRoutesCount}</span> voies.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab("unvalidated")}
              className={`px-4 py-2 rounded-lg ${selectedTab === "unvalidated"
                  ? "bg-primary text-black font-bold"
                  : "bg-gray-700 text-white"
                }`}
            >
              Voies non validées
            </button>
            <button
              onClick={() => setSelectedTab("validated")}
              className={`px-4 py-2 rounded-lg ${selectedTab === "validated"
                  ? "bg-primary text-black font-bold"
                  : "bg-gray-700 text-white"
                }`}
            >
              Voies validées
            </button>
          </div>
        </div>

       {/* Routes List Section */}
<div className="space-y-2">
  {/* Admin Add Route Button */}
  {isAdmin && <AddRouteModal />}

  {/* Routes */}
  {isLoading ? (
    <p className="text-white text-center">Loading...</p>
  ) : finalFilteredRoutes && finalFilteredRoutes.length > 0 ? (
    finalFilteredRoutes.map((route) => {
      const isValidated = authUser?.climbedRoutes.some(
        (climbedRoute) => climbedRoute._id === route._id
      );
      return (
        <div
          key={route._id}
          className="flex items-center justify-between bg-[#808080] rounded-lg p-2 hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => setSelectedRoute(route)} // Open modal on click
        >
          {/* Grade */}
          <div className="text-lg font-bold w-16 text-center">
            {route.grade}
          </div>

          {/* Thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 mx-2">
            <img
              src={route.thumbnail || "/thumbnail-placeholder.png"}
              alt={route.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Route Name */}
          <div className="flex-grow mx-2">
            <h2 className="text-lg font-bold">{route.name}</h2>
          </div>

          {/* Difficulty Points and Validations */}
          <div className="text-right w-24">
            <p className="text-lg font-bold">{route.difficultyPoints}</p>
            <p className="text-sm text-gray-200">
              {route.successfulClimbs} validations
            </p>
          </div>

          {/* Validation Checkmark */}
          {/* {isValidated && (
            <div className="ml-4 text-green-400">
              <img src="/icons/check.png" alt="check" className="w-6 h-6" />
            </div>
          )} */}
        </div>
      );
    })
  ) : (
    <div className="text-white text-center">
      Aucune voie disponible.
    </div>
  )}
</div>

      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <RouteCardModal
          selectedRoute={selectedRoute}
          closeModal={closeModal}
          isAdmin={isAdmin}
          tempImg={tempImg}
          imgInputRef={imgInputRef}
          handleImageChange={handleImageChange}
          handleValidate={handleValidate}
          validateRouteMutation={validateRouteMutation}
          handleAddAsProject={handleAddAsProject}
          addAsProjectMutation={addAsProjectMutation}
          authUser={authUser}
          fetchUserDetails={fetchUserDetails} // Pass fetchUserDetails to the modal
        />
      )}
    </div>
  );
};

export default VoiePage;