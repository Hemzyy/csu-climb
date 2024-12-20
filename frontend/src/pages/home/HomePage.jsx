import React from "react";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const user = {
    profileImg: authUser?.profileImg,
    username: authUser?.username,
    rank: authUser?.rank,
    leaderboardScore: authUser?.leaderboardScore,
    climbedRoutes: authUser?.climbedRoutes || [],
  };

  console.log("Climbed Routes:", user.climbedRoutes);

  const groupedRoutes = user.climbedRoutes.reduce((acc, route) => {
    acc[route.grade] = (acc[route.grade] || 0) + 1;
    return acc;
  }, {});

  const sortedRoutes = Object.entries(groupedRoutes)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => {
      const parseGrade = (grade) => {
        const [number, letter] = grade.match(/(\d+)([a-zA-Z]*)/).slice(1);
        return [parseInt(number), letter];
      };

      const [aNum, aLetter] = parseGrade(a.grade);
      const [bNum, bLetter] = parseGrade(b.grade);

      if (aNum !== bNum) return bNum - aNum;
      return aLetter.localeCompare(bLetter);
    });

  return (
    <div className="flex justify-center w-screen min-h-screen bg-[#1D232A] pt-16">
      <div className="flex flex-col gap-y-20 w-[90%] sm:w-[70%] lg:w-[50%] items-center">
        {/* Main user stats section */}
        <div className="mt-10 bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col gap-y-6 w-full">
          <div className="text-center text-white text-xl font-semibold">
            VOS STATISTIQUES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#1D232A] text-white p-4 rounded-lg">
            {/* Avatar and username */}
            <div className="flex flex-col items-center">
              <img
                src={user.profileImg || user?.profileImg || "https://via.placeholder.com/100"}
                alt="avatar"
                className="w-28 h-28 rounded-full"
              />
              <div className="font-bold mt-2">{user.username}</div>
            </div>

            {/* Rank and points */}
            <div className="flex flex-col items-center justify-center gap-2 bg-[#2E4259] p-4 rounded-lg">
              <div className="text-lg font-bold">
                Rank: <span>{user.rank}</span>
              </div>
              <div className="text-lg font-bold">
                Points: <span>{user.leaderboardScore}</span>
              </div>
            </div>

            {/* Highest routes */}
            <div className="grid grid-cols-2 gap-4 justify-center">
              {sortedRoutes.length > 0 ? (
                sortedRoutes.slice(0, 4).map((route, index) => (
                  <div
                    key={index}
                    className="bg-[#2E4259] p-3 w-full rounded-lg text-center shadow-md flex flex-col justify-center"
                  >
                    <span className="text-lg font-bold text-white">
                      {route.grade}
                    </span>
                    <span className="text-sm text-gray-300">{route.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-white text-center col-span-2">
                  No routes climbed yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
