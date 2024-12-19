import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const VoiePage = () => {
  //const { routeId } = useParams();
  const { id } = useParams();
  console.log("Route ID:", id);

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

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error loading route.</div>;
  }

  return (
    <div className="flex flex-col items-center w-screen min-h-screen bg-[#1D232A] pt-16">
      {/* Header */}
      <div className="text-white text-2xl font-bold mt-10">{route.name}</div>

      {/* Route Details */}
      <div className="w-[90%] lg:w-[50%] bg-[#2E4259] p-6 rounded-lg shadow-md mt-8">
        <img
          src={route.image || "https://via.placeholder.com/300"}
          alt={route.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-sm text-gray-400 mb-2">
          <strong>Grade:</strong> {route.grade}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          <strong>Points:</strong> {route.difficultyPoints}
        </p>
        <p className="text-white mt-4">{route.description}</p>
      </div>
    </div>
  );
};

export default VoiePage;