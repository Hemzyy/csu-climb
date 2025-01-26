import React, { useState, useEffect } from "react";
import EditRouteModal from "./EditRouteModal";
import ValidatedByModal from "./ValidatedByModal"; // Import the new modal

import toast from 'react-hot-toast';

const RouteCardModal = ({
  selectedRoute,
  closeModal,
  isAdmin,
  tempImg,
  imgInputRef,
  handleImageChange,
  handleValidate,
  validateRouteMutation,
  handleAddAsProject,
  addAsProjectMutation,
  authUser,
  fetchUserDetails,
}) => {
  const [validatedUsers, setValidatedUsers] = useState([]);
  const [showValidatedModal, setShowValidatedModal] = useState(false); // State for the new modal

  useEffect(() => {
    const fetchValidatedUsers = async () => {
      if (selectedRoute?.validatedBy?.length) {
        try {
          const userDetails = await Promise.all(
            selectedRoute.validatedBy.map((userId) => fetchUserDetails(userId))
          );
          setValidatedUsers(userDetails);
        } catch (error) {
          console.error("Error fetching validated users:", error);
        }
      }
    };

    fetchValidatedUsers();
  }, [selectedRoute, fetchUserDetails]);

  const validatedByCount = selectedRoute?.validatedBy?.length || 0;

  // animation -----------------
  const [animateValidateButton, setAnimateValidateButton] = useState(false);

  const handleValidateClick = (routeId) => {
    // Check if the route is currently validated
    const isCurrentlyValidated = authUser?.climbedRoutes.some(
      (climbedRoute) => climbedRoute._id === routeId
    );
    // Call handleValidate function and pass a callback to check the updated state
    handleValidate(routeId);

    // Trigger animation only if the route was not already validated
    if (!isCurrentlyValidated) {
      setAnimateValidateButton(true);
      setTimeout(() => setAnimateValidateButton(false), 1000);
      toast.success("Voie validée !");
    } else {
      toast("Voie retirée de vos voies validées");
    }
  };


  return (
    selectedRoute && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#535353] text-white rounded-lg shadow-lg sm:w-96 w-80 pb-4 relative">
          <button
            className="absolute -right-8 -top-4 text-white text-4xl"
            onClick={closeModal}
          >
            &times;
          </button>
          {/* Route top details */}
          <div className="flex items-center justify-between px-4">
            <p className="text-xl">{selectedRoute.grade}</p>
            <h2 className="text-2xl font-bold m-2 pl-6">{selectedRoute.name}</h2>
            <div className="flex items-center gap-1">
              <p className="text-xl">{selectedRoute.difficultyPoints}</p>
              <img src="/icons/pointsB.png" alt="points" className="w-6 h-6" />
            </div>
          </div>
          <div className="relative">
            <img
              src={tempImg || selectedRoute.img || "/route-img-placeholder.png"}
              alt={selectedRoute.name}
              className="w-full h-[30rem] object-cover mb-4"
            />
            {isAdmin && (
              <EditRouteModal
                route={selectedRoute}
                imageInputRef={imgInputRef}
              />
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              ref={imgInputRef}
              onChange={handleImageChange}
            />
            {/* Bottom-right save project Button */}
            <button
              className={`absolute bottom-24 right-6 h-12 w-12 rounded-full shadow-md flex items-center justify-center transition-colors ${authUser?.projects.some(
                (project) => project._id === selectedRoute._id
              )
                  ? "bg-green-500 text-black"
                  : "bg-[#FE5F55] text-black"
                }`}
              onClick={() => handleAddAsProject(selectedRoute._id)}
              disabled={addAsProjectMutation.isLoading}
              title="Ajouter cette voie à mes projets"
            >
              <img
                src="/icons/mark.png"
                alt="Checkmark Icon"
                className="w-6 h-6"
              />
            </button>
            {/* Bottom-right Validate Button */}
            <button
              className={`absolute bottom-4 right-4 h-16 w-16 rounded-full shadow-md flex items-center justify-center transition-colors ${animateValidateButton ? "motion-preset-confetti motion-duration-2000" : ""
                } ${authUser?.climbedRoutes.some(
                  (climbedRoute) => climbedRoute._id === selectedRoute._id
                )
                  ? "bg-green-500 text-black"
                  : "bg-[#FE5F55] text-black"
                }`}
              onClick={() => handleValidateClick(selectedRoute._id)}
              disabled={validateRouteMutation.isLoading}
              title="Valider cette voie"
            >
              <img
                src="/icons/coche.png"
                alt="Checkmark Icon"
                className="w-7 h-7"
              />
            </button>
          </div>
          {/* Validated by section */}
          <div className="mt-4 px-4">
            <button
              className="text-sm underline"
              onClick={() => setShowValidatedModal(true)}
            >
              Validée par {validatedByCount}
            </button>
          </div>
        </div>
        {/* Show ValidatedByModal */}
        {showValidatedModal && (
          <ValidatedByModal
            validatedUsers={validatedUsers}
            closeModal={() => setShowValidatedModal(false)}
          />
        )}
      </div>
    )
  );
};

export default RouteCardModal;