import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

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



const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: topThree, isLoading, isError } = useQuery({
    queryKey: ["topThree"],
    queryFn: fetchTopThree,
  });

  const { data: restOfList, isLoading: loadingRest, isError: errorRest } = useQuery({
    queryKey: ["restOfList"],
    queryFn: fetchRestOfList,
  });

  const { data: routes, isLoading: ladingRoutes } = useQuery({
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
          throw new Error(error.message);
        }
      },
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
    <div className="bg-custom-bg bg-fixed bg-center flex flex-col justify-center w-full max-w-6xl mx-auto min-h-screen pt-16 text-white mt-20 gap-12">

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
              <span className="text-black font-bold text-2xl sm:text-4xl">{value}</span>
            </div>
            <span className="mt-2 sm:mt-4 text-lg sm:text-2xl">{label}</span>
          </div>
        ))}
      </div>

      {/* Top 3 then next 4 */}
      <div className="flex flex-col items-center justify-center gap-8 sm:justify-evenly bg-[#525458] p-4 rounded-2xl shadow-lg space-y-2 sm:space-y-0 sm:space-x-4 mt-4 mb-4">

        <div className="flex justify-evenly sm:gap-16"> {/* TOP 3 DIV */}
          {/* first place */}
          <div className="flex flex-col items-center order-1 sm:order-2 p-4 mt-4">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
              <img
                src={topThree[0]?.profileImg || "https://via.placeholder.com/100"}
                alt="avatar"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
              />
              <div className="absolute -top-2 right-1 bg-[#FFD700] text-black rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm">1</div>
            </div>
            <span className="text-lg sm:text-2xl mt-2">{topThree[0]?.username}</span>
            <div className="flex justify-center gap-3 items-center bg-[#FFD700] text-black rounded-lg w-28 h-12 mt-2 shadow-lg">
              <img src="/icons/points.png" alt="points" className="w-8 h-8" />
              <span className="text-lg sm:text-3xl font-bold">{topThree[0]?.leaderboardScore}</span>
            </div>
          </div>
          {/* second place */}
          <div className="flex flex-col items-center order-2 sm:order-1 p-4 mt-4 sm:mt-12">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#C0C0C0] flex items-center justify-center shadow-lg">
              <img
                src={topThree[1]?.profileImg || "https://via.placeholder.com/100"}
                alt="avatar"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
              />
              <div className="absolute -top-2 right-1 bg-[#C0C0C0] text-black rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm">2</div>
            </div>
            <span className="text-lg sm:text-2xl mt-2">{topThree[1]?.username}</span>
            <div className="flex justify-center gap-3 items-center bg-[#C0C0C0] text-black rounded-lg w-28 h-12 mt-2 shadow-lg">
              <img src="/icons/points.png" alt="points" className="w-8 h-8" />
              <span className="text-lg sm:text-3xl font-bold">{topThree[1]?.leaderboardScore}</span>
            </div>
          </div>
          {/* third place */}
          <div className="flex flex-col items-center order-3 sm:order-3 p-4 mt-4 sm:mt-12">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#cd7f32] flex items-center justify-center shadow-lg">
              <img
                src={topThree[2]?.profileImg || "https://via.placeholder.com/100"}
                alt="avatar"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
              />
              <div className="absolute -top-2 right-1 bg-[#cd7f32] text-black rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-sm">3</div>
            </div>
            <span className="text-lg sm:text-2xl mt-2">{topThree[2]?.username}</span>
            <div className="flex justify-center gap-3 items-center bg-[#cd7f32] text-black rounded-lg w-28 h-12 mt-2 shadow-lg">
              <img src="/icons/points.png" alt="points" className="w-8 h-8" />
              <span className="text-lg sm:text-3xl font-bold">{topThree[2]?.leaderboardScore}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-evenly sm:gap-12"> {/* NEXT 4 DIV */}
          {restOfList.slice(0, 4).map((user, index) => (
            <div key={index} className="flex flex-col items-center p-4 mt-4">
              <div className="relative w-32 h-32 sm:w-32 sm:h-32 rounded-full bg-[#808080] flex items-center justify-center shadow-lg">
                <img
                  src={user.profileImg || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
                />
                <div className="absolute -top-2 right-1 bg-[#808080] text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-semibold shadow-sm">{index + 4}</div>
              </div>
              <span className="text-lg sm:text-2xl mt-2">{user.username}</span>
              <div className="flex justify-center gap-3 items-center bg-[#808080] text-black rounded-lg w-28 h-12 mt-2 shadow-lg">
                <img src="/icons/points.png" alt="points" className="w-8 h-8" />
                <span className="text-lg sm:text-3xl font-bold">{user.leaderboardScore}</span>
              </div>
            </div>
          ))}
        </div>

        <Link to="/classement">
          <button className="bg-primary text-black text-2xl font-bold rounded-full w-96 h-12 mt-4 shadow-lg hover:bg-red-600">Voir le classement</button>
        </Link>

      </div>

      {/* Newly opened routes  (2 latest roures) */}
      <div className="flex flex-col items-center gap-8 justify-center bg-[#525458] p-4 rounded-2xl shadow-lg space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="flex items-center justify-center gap-8">
          {routes.slice(0, 2).map((route, index) => (
            <Link to={`/voie/${route._id}`} key={route._id}>
              <div key={index} className="relative w-full sm:w-60 h-64 rounded-2xl overflow-hidden shadow-lg m-2">
                <img
                  src={route.img || "/route-img-placeholder.png"}
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute flex bg-[#13C4A3] w-16 h-8 bottom-4 left-4 rounded-full text-center justify-center items-center text-black font-bold"> 
                  <span> {route.grade} </span>
                </div>
                <div className="absolute flex bg-[#13C4A3] w-16 h-8 bottom-4 right-4 rounded-full text-center justify-center items-center text-black font-bold"> 
                  <span> {route.difficultyPoints} </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/classement">
          <button className="bg-primary text-black text-2xl font-bold rounded-full w-96 h-12 mt-4 shadow-lg hover:bg-red-600">Voir toutes les voies</button>
        </Link>

      </div>  
      

    </div>

  );
};

export default HomePage;
