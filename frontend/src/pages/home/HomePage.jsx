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

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: topThree, isLoading, isError } = useQuery({
    queryKey: ["topThree"],
    queryFn: fetchTopThree,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading top three data.</div>;
  }

  const user = {
    profileImg: authUser?.profileImg,
    username: authUser?.username,
    rank: authUser?.rank,
    leaderboardScore: authUser?.leaderboardScore,
    climbedRoutes: authUser?.climbedRoutes || [],
  };

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
    // main div that will contain the three sectionsn (user stat, top 7, and newly ioened routes)
    <div className="bg-custom-bg flex flex-col justify-center w-full max-w-6xl mx-auto min-h-screen pt-16 text-white">

      {/* user stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-evenly bg-[#525458] p-4 rounded-2xl shadow-lg space-y-2 sm:space-y-0 sm:space-x-4">
        {/* User image and username */}
        <div className="flex flex-col items-center text-center">
          <img
            src={user.profileImg}
            alt="profile"
            className="w-24 h-24 sm:w-40 sm:h-40 rounded-full"
          />
          <span className="text-xl sm:text-3xl mt-2">{user.username}</span>
        </div>

        {/* Stats */}
        {[{
          icon: "/icons/podium.png",
          value: user.rank,
          label: "Rang"
        }, {
          icon: "/icons/points.png",
          value: user.leaderboardScore,
          label: "Points"
        }, {
          icon: "/icons/climbing.png",
          value: user.climbedRoutes.length,
          label: "Voies"
        }].map(({ icon, value, label }, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex flex-col bg-[#FE5F55] h-24 w-32 sm:h-32 sm:w-44 rounded-3xl items-center justify-center shadow-lg mt-4">
              <img src={icon} alt={label} className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
              <span className="text-black font-bold text-2xl sm:text-3xl">{value}</span>
            </div>
            <span className="mt-2 sm:mt-4 text-lg sm:text-2xl">{label}</span>
          </div>
        ))}
      </div>

      {/* Top 3 followed by the next 4 inline*/}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-evenly bg-[#525458] p-4 rounded-2xl shadow-lg space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
      
        

      </div>
      

    </div>

  );
};

export default HomePage;
