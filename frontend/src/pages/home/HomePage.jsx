import React from "react";

import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const user = {
    avatar: authUser?.avatar || "https://via.placeholder.com/100",
    username: authUser?.username,
    rank: authUser?.rank,
    leaderboardScore: authUser?.leaderboardScore,
    climbedRoutes: authUser?.climbedRoutes || [],
  };

  console.log("Climbed Routes:", user.climbedRoutes);

  // Group routes by grade and calculate counts
  const groupedRoutes = user.climbedRoutes.reduce((acc, route) => {
    acc[route.grade] = (acc[route.grade] || 0) + 1;
    return acc;
  }, {});

  // Convert grouped object into an array and sort by grade difficulty
  const sortedRoutes = Object.entries(groupedRoutes)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => {
      // Sort numerically first, then alphabetically
      const parseGrade = (grade) => {
        const [number, letter] = grade.match(/(\d+)([a-zA-Z]*)/).slice(1);
        return [parseInt(number), letter];
      };

      const [aNum, aLetter] = parseGrade(a.grade);
      const [bNum, bLetter] = parseGrade(b.grade);

      if (aNum !== bNum) return bNum - aNum; // Higher numbers first
      return aLetter.localeCompare(bLetter); // Then sort letters
    });

  return (
    <>
      <div className="flex justify-center w-screen min-h-screen bg-[#1D232A] pt-16">
        
        <div className="flex flex-col gap-y-20 w-[50%] items-center h-screen">
          {/* Main user stats section */}
          <div className="mt-10 bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col w-[100%] h-[40%]">
            <div className="text-center text-white">VOS STATISTIQUES</div>
            <div className="flex items-center justify-between bg-[#1D232A] text-white p-2 rounded-lg mt-8 -mb-1 h-[100%]">
              {/* Avatar and username */}
              <div className="flex flex-col items-center pl-4">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full"
                />
                <div className="font-bold mt-2">{user.username}</div>
              </div>

              {/* Rank and points */}
              <div className="flex flex-col items-center justify-center gap-4 space-y-2 bg-[#2E4259] p-4 rounded-lg h-[90%]">
                <div className="text-2xl font-bold text-white">
                  Rank: <span>{user.rank}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  Points: <span>{user.leaderboardScore}</span>
                </div>
              </div>

              {/* Highest routes */}
              <div className="grid grid-cols-2 gap-4 justify-center pr-6 ml-0">
                {sortedRoutes.length > 0 ? (
                  sortedRoutes.slice(0, 4).map((route, index) => (
                    <div
                      key={index}
                      className="bg-[#2E4259] p-3 w-24 h-16 rounded-lg text-center shadow-md flex flex-col justify-center"
                    >
                      <span className="text-lg font-bold text-white">
                        {route.grade}
                      </span>
                      <span className="text-sm text-gray-300">
                        {route.count}
                      </span>
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
    </>
  );
};

export default HomePage;
