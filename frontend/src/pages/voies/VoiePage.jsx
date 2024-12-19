import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const VoiePage = () => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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

  const validateRouteMutation = useMutation({
    mutationFn: async (routeId) => {
      try {
        const res = await fetch(`/api/routes/validate/${routeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Failed to validate route");
        }
        return await res.json();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate the routes query to refresh the data
      queryClient.invalidateQueries(["routes"]);
    },
  });

  const handleValidate = (routeId) => {
    validateRouteMutation.mutate(routeId);
  };

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
                  <p className="text-sm text-gray-400">
                    <strong>Grade:</strong> {route.grade}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Points:</strong> {route.difficultyPoints}
                  </p>
                  <button
                    className={`mt-4 px-4 py-2 rounded bg-[#2E4259] text-white font-bold hover:bg-[#3C566F] ${
                      validateRouteMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleValidate(route._id)}
                    disabled={validateRouteMutation.isLoading}
                  >
                    Validate
                  </button>
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
