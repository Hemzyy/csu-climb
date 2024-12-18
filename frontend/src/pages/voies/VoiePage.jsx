import React from "react";
import { useQuery } from "@tanstack/react-query";

const VoiePage = () => {
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
        throw new Error(error);
      }
    },
  });

  return (
    <div className="flex justify-center w-screen min-h-screen bg-[#1D232A] pt-16">
      <div className="flex flex-col gap-y-20 w-[50%] items-center h-screen">
        {/* Page Header */}
        <div className="text-white text-2xl font-bold mt-10">
          Explore Climbing Routes
        </div>

        {/* Routes Section */}
        <div className="bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col w-[100%] h-[75%] overflow-y-auto">
          <div className="text-center text-white">AVAILABLE ROUTES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {isLoading && (
              <p className="text-white text-center col-span-2">Loading...</p>
            )}
            {routes && routes.length > 0 ? (
              routes.map((route) => (
                <div
                  key={route._id}
                  className="bg-[#1D232A] p-4 rounded-lg shadow-md flex flex-col gap-y-2"
                >
                  <h2 className="text-lg font-bold text-white">{route.name}</h2>
                  <p className="text-sm text-gray-300">{route.description}</p>
                  <p className="text-sm text-gray-400">
                    <strong>Grade:</strong> {route.grade}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Location:</strong> {route.location}
                  </p>
                </div>
              ))
            ) : (
              !isLoading && (
                <div className="text-white text-center col-span-2">
                  No routes available
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiePage;
