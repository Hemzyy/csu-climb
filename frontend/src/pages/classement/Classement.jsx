import React from "react";
import { useQuery } from "@tanstack/react-query";

const fetchTopThree = async () => {
  const res = await fetch("/api/leaderboard/topThree");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

const fetchRestOfList = async () => {
  const res = await fetch("/api/leaderboard/GetRestOfList");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

const Classement = () => {
  const { data: topThree, isLoading: loadingTopThree, isError: errorTopThree } = useQuery({
    queryKey: ["topThree"],
    queryFn: fetchTopThree,
  });

  const { data: restOfList, isLoading: loadingRest, isError: errorRest } = useQuery({
    queryKey: ["restOfList"],
    queryFn: fetchRestOfList,
  });

  if (loadingTopThree || loadingRest) return <div>Loading...</div>;
  if (errorTopThree || errorRest) return <div>Error loading leaderboard!</div>;

  return (
    <div className="flex justify-center w-screen min-h-screen bg-[#1D232A] pt-16">
      <div className="flex flex-col gap-y-4 w-[90%] sm:w-[70%] lg:w-[50%] items-center">
        {/* Top 3 Section */}
        <div className="mt-10 bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col gap-y-6 w-full">
          <div className="text-center text-white text-xl font-semibold">
            TOP 3
          </div>

          <div className="relative flex items-center justify-center gap-x-14 bg-[#1D232A] p-6 rounded-lg">
            {/* Second Place */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full bg-[#2E4259] flex items-center justify-center">
                <img
                  src={topThree[1]?.profileImg || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute -top-4 right-0 bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  2
                </div>
              </div>
              <span className="text-lg font-bold text-white mt-2">
                {topThree[1]?.username || "N/A"}
              </span>
              <span className="text-gray-300">
                {topThree[1]?.leaderboardScore || 0} Points
              </span>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                <img
                  src={topThree[0]?.profileImg || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="w-28 h-28 rounded-full object-cover"
                />
                <div className="absolute -top-4 right-0 bg-[#FFD700] text-black rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">
                  1
                </div>
              </div>
              <span className="text-lg font-bold text-white mt-2">
                {topThree[0]?.username || "N/A"}
              </span>
              <span className="text-gray-300">
                {topThree[0]?.leaderboardScore || 0} Points
              </span>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full bg-[#CD7F32] flex items-center justify-center">
                <img
                  src={topThree[2]?.profileImg || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute -top-4 right-0 bg-[#CD7F32] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  3
                </div>
              </div>
              <span className="text-lg font-bold text-white mt-2">
                {topThree[2]?.username || "N/A"}
              </span>
              <span className="text-gray-300">
                {topThree[2]?.leaderboardScore || 0} Points
              </span>
            </div>
          </div>
        </div>

        {/* Rest of the List */}
        <div className="mt-10 bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col gap-y-6 w-full">
          <div className="text-center text-white text-xl font-semibold">LEADERBOARD</div>
          <ul className="list-none p-0">
            {restOfList.map((user, index) => (
              <li
                key={user.id || `user-${index}`}
                className="flex items-center justify-between bg-[#1D232A] rounded-lg p-4 mb-2"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold">{index + 4}</span>
                  <img
                    src={user.profileImg || "https://via.placeholder.com/100"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-white font-bold">{user.username || "N/A"}</span>
                </div>
                <span className="text-gray-300">{user.leaderboardScore || 0} Points</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Classement;
