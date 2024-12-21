import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useValidate from "../../hooks/useValidate";

const VoiePage = () => {
  const { id } = useParams();
  const imageInputRef = useRef(null);

  const { data: authUser, isLoading: isAuthUserLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const validateRouteMutation = useValidate();

  const { data: route, isLoading, isError } = useQuery({
    queryKey: ["voie", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/routes/voie/${id}`);
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

  const handleValidate = () => {
    validateRouteMutation.mutate(id);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`/api/routes/voie/${id}/image`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload image");
        }

        // Optionally refetch the route data to reflect the updated image
        window.location.reload(); // Temporary reload for simplicity
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const isRouteValidated = authUser?.climbedRoutes.some(
    (climbedRoute) => climbedRoute._id === id
  );

  if (isLoading || isAuthUserLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (isError) {
    return <div className="text-white">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center w-screen min-h-screen bg-[#1D232A] pt-16">
      <div className="text-white text-2xl font-bold mt-10">{route.name}</div>
      <div className="w-[90%] lg:w-[50%] bg-[#2E4259] p-6 rounded-lg shadow-md mt-8">
        <div className="relative">
          <img
            src={route.image || "https://via.placeholder.com/300"}
            alt={route.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          {authUser?.isAdmin && (
            <button
              className="btn btn-primary rounded-full btn-sm absolute top-2 right-2"
              onClick={() => imageInputRef.current.click()}
            >
              Edit Image
            </button>
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-white mb-2">
              <strong>Grade:</strong> {route.grade}
            </p>
            <p className="text-white">
              <strong>Points: </strong> {route.difficultyPoints}
            </p>
            <p className="text-white">
              <strong>Setter: </strong> {route.setter}
            </p>
          </div>
          <div>
            <button
              className="btn btn-outline rounded-full btn-md"
              onClick={handleValidate}
              disabled={validateRouteMutation.isLoading}
            >
              {validateRouteMutation.isLoading ? "Validating..." : isRouteValidated ? "Unvalidate": "Validate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiePage;
