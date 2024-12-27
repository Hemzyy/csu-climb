import React, { useRef } from "react";
import EditRouteModal from "./EditRouteModal";

const RouteCardModal = ({
  selectedRoute,
  closeModal,
  isAdmin,
  tempImg,
  imgInputRef,
  handleImageChange,
  handleValidate,
  validateRouteMutation,
  authUser,
}) => {
  return (
    selectedRoute && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#535353] text-white rounded-lg shadow-lg w-96 pb-4 relative">
          <button
            className="absolute -right-8 -top-4 text-white text-4xl"
            onClick={closeModal}
          >
            &times;
          </button>
          {/* Route top details */}
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-bold m-2">{selectedRoute.name}</h2>
            <div className="flex items-center gap-2">
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
            <button className="absolute bottom-24 right-6 h-12 w-12 rounded-full shadow-md flex items-center justify-center transition-colors bg-[#FE5F55] text-black">
              <img
                src="/icons/mark.png"
                alt="Checkmark Icon"
                className="w-6 h-6"
              />
            </button>
            {/* Bottom-right Validate Button */}
            <button
              className={`absolute bottom-4 right-4 h-16 w-16 rounded-full shadow-md flex items-center justify-center transition-colors ${
                authUser?.climbedRoutes.some(
                  (climbedRoute) => climbedRoute._id === selectedRoute._id
                )
                  ? "bg-green-500 text-black"
                  : "bg-[#FE5F55] text-black"
              }`}
              onClick={() => handleValidate(selectedRoute._id)}
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
          <p className="px-4">
            <strong>Validated by:</strong> 18
          </p>
        </div>
      </div>
    )
  );
};

export default RouteCardModal;
