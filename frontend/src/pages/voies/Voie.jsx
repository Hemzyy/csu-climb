import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useValidate from "../../hooks/useValidate";

const VoiePage = () => {
  const { id } = useParams();
  const { data: authUser, isLoading: isAuthUserLoading } = useQuery({ queryKey: ["authUser"] });
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
    }
  });

  const handleValidate = () => {
    validateRouteMutation.mutate(id);
  };

  const isRouteValidated = authUser?.climbedRoutes.some((climbedRoute) => climbedRoute._id === id);

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
        <img
          src={route.image || "https://via.placeholder.com/300"}
          alt={route.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
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
              {validateRouteMutation.isLoading ? "Validating..." : isRouteValidated ? "Unvalidate" : "Validate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiePage;