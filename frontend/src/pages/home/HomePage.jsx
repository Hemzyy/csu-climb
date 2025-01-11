import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Generic fetch function
const fetchData = async (endpoint) => {
  const res = await fetch(endpoint);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

// Grade parser for sorting
const parseGrade = (grade) => {
  const [number, letter] = grade.match(/(\d+)([a-zA-Z]*)/).slice(1);
  return [parseInt(number, 10), letter];
};

const HomePage = () => {
  // Queries
  const { data: authUser } = useQuery({ queryKey: ["authUser"], queryFn: () => fetchData("/api/auth/me") });

  const { data: topThree = [], isLoading, isError } = useQuery({
    queryKey: ["topThree"],
    queryFn: () => fetchData("/api/leaderboard/topThree"),
  });

  const { data: restOfList = [], isLoading: loadingRest, isError: errorRest } = useQuery({
    queryKey: ["restOfList"],
    queryFn: () => fetchData("/api/leaderboard/GetRestOfList"),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["routes"],
    queryFn: () => fetchData("/api/routes"),
  });

  // Handle loading and error states
  if (isLoading || loadingRest) return <div>Loading...</div>;
  if (isError || errorRest) return <div>Error loading leaderboard data.</div>;

  // Process user data
  const user = {
    profileImg: authUser?.profileImg,
    username: authUser?.username,
    rank: authUser?.rank,
    leaderboardScore: authUser?.leaderboardScore,
    climbedRoutes: authUser?.climbedRoutes || [],
  };

  // Check if there are valid users in the top 3 with points
  const validTopThree = topThree.filter(user => user?.leaderboardScore > 0);

  //filter out users with 0 points from restOfList
  const validRestOfList = restOfList.filter(user => user?.leaderboardScore > 0);

  return (
    // main div that will contain the three sections
    <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-5 sm:pt-[10rem] pt-[5rem]">

      <h1 className="text-3xl font-bold text-center">Page d'acceuil</h1>


      {/* user stats */}
      <div className="flex-col sm:flex-row items-center justify-center sm:space-y-0 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
        {/* User image and username */}
        <div className="flex flex-col items-center text-center">
          <img
            src={user.profileImg || "/avatar-placeholder.png"}
            alt="profile"
            className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover"
          />
          <span className="text-xl sm:text-3xl mt-2">{user.username}</span>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-0">
          {[{
            icon: "/icons/podiumB.png",
            value: user.leaderboardScore === 0 ? "Unranked" : user.rank,
            label: "Rang"
          }, {
            icon: "/icons/pointsB.png",
            value: user.leaderboardScore,
            label: "Points"
          }, {
            icon: "/icons/climbingB.png",
            value: user.climbedRoutes.length,
            label: "Voies"
          }].map(({ icon, value, label }, index, array) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col h-16 w-24 sm:h-24 sm:w-40 rounded-3xl items-center justify-center mt-8">
                    <img src={icon} alt={label} className="w-7 h-7 sm:w-10 sm:h-10" />
                    <span className="text-white font-bold text-2xl sm:text-4xl">{value}</span>
                  <span className="mt-2 sm:mt-4 text-lg sm:text-2xl">{label}</span>
                </div>
                
              </div>
              {/* Divider Line */}
              {index < array.length - 1 && (
                <div className="h-16 sm:h-24 w-px bg-gray-400 opacity-50"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* <hr className="border-gray-400 opacity-40 w-3/4 mx-auto mt-8 mb-8" /> */}

      {/* Top 3 then next 4 */}
      {validTopThree.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-6 sm:justify-evenly p-4 space-y-2 sm:space-y-0 bg-[#626262] bg-opacity-20 rounded-xl">

          <h1 className="text-4xl"> Classement </h1>
          <div className="flex justify-evenly sm:gap-2"> {/* TOP 3 DIV */}
            {/* first place */}
            <div className="flex flex-col items-center order-1 sm:order-2 p-4 mt-4">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg">
                <Link to={`/profile/${topThree[0]?.username}`} >
                  <img
                    src={topThree[0]?.profileImg || "/avatar-placeholder.png"}
                    alt="avatar"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                  />
                </Link>
                <div className="absolute -top-2 right-1 bg-[#FFD700] text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-semibold shadow-sm">1</div>
              </div>
              <span className="text-lg sm:text-2xl mt-2">{topThree[0]?.username}</span>
              <div className="flex justify-center gap-2 items-center bg-[#FFD700] text-black rounded-lg w-24 h-10 mt-2 shadow-lg">
                <span className="text-lg sm:text-2xl font-bold pb-0.5">{topThree[0]?.leaderboardScore}</span>
                <img src="/icons/points.png" alt="points" className="w-6 h-6" />
              </div>
            </div>
            {/* second place */}
            {topThree[1] && topThree[1]?.leaderboardScore > 0 && (
              <div className="flex flex-col items-center order-2 sm:order-1 p-4 mt-4 sm:mt-12">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#C0C0C0] flex items-center justify-center shadow-lg">
                  <Link to={`/profile/${topThree[1]?.username}`} >
                    <img
                      src={topThree[1]?.profileImg || "/avatar-placeholder.png"}
                      alt="avatar"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                    />
                  </Link>
                  <div className="absolute -top-2 right-1 bg-[#C0C0C0] text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-semibold shadow-sm">2</div>
                </div>
                <span className="text-lg sm:text-2xl mt-2">{topThree[1]?.username}</span>
                <div className="flex justify-center gap-2 items-center bg-[#C0C0C0] text-black rounded-lg w-24 h-10 mt-2 shadow-lg">
                  <span className="text-lg sm:text-2xl font-bold pb-0.5">{topThree[1]?.leaderboardScore}</span>
                  <img src="/icons/points.png" alt="points" className="w-6 h-6" />
                </div>
              </div>
            )}
            
            {/* third place */}
            {topThree[2] && topThree[2]?.leaderboardScore > 0 && (
              <div className="flex flex-col items-center order-3 sm:order-3 p-4 mt-4 sm:mt-12">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#cd7f32] flex items-center justify-center shadow-lg">
                  <Link to={`/profile/${topThree[2]?.username}`} >
                    <img
                      src={topThree[2]?.profileImg || "/avatar-placeholder.png"}
                      alt="avatar"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                    />
                  </Link>
                  <div className="absolute -top-2 right-1 bg-[#cd7f32] text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-semibold shadow-sm">3</div>
                </div>
                <span className="text-lg sm:text-2xl mt-2">{topThree[2]?.username}</span>
                <div className="flex justify-center gap-3 items-center bg-[#cd7f32] text-black rounded-lg w-24 h-10 mt-2 shadow-lg">
                  <img src="/icons/points.png" alt="points" className="w-6 h-6" />
                  <span className="text-lg sm:text-2xl font-bold">{topThree[2]?.leaderboardScore}</span>
                </div>
              </div>
            )}
            
          </div>

          <div className="flex flex-wrap justify-evenly sm:gap-6"> {/* NEXT 4 DIV */}
            {validRestOfList.length > 0 ? (
              validRestOfList.slice(0, 4).map((user, index) => (
                <div key={index} className="flex flex-col items-center p-4 mt-4">
                  <div className="relative w-28 h-28 sm:w-28 sm:h-28 rounded-full bg-[#808080] flex items-center justify-center shadow-lg">
                    <Link to={`/profile/${user?.username}`} >
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt="avatar"
                        className="w-24 h-24 sm:w-24 sm:h-24 rounded-full object-cover"
                      />
                    </Link>
                    <div className="absolute -top-2 right-1 bg-[#808080] text-black rounded-full w-8 h-8 flex items-center justify-center text-xl font-semibold shadow-sm">{index + 4}</div>
                  </div>
                  <span className="text-lg sm:text-2xl mt-2">{user.username}</span>
                  <div className="flex justify-center gap-3 items-center bg-[#808080] text-black rounded-lg w-24 h-10 mt-2 shadow-lg">
                    <img src="/icons/points.png" alt="points" className="w-6 h-6" />
                    <span className="text-lg sm:text-2xl font-bold">{user.leaderboardScore}</span>
                  </div>
                </div>
              ))
            ) : (
              // <div className="text-lg sm:text-2xl mt-4">Pas assez de joueurs pour afficher le reste du classement</div>
              <div>Pas assez de jouer ayant des points pour afficher le reste du classement</div>
            )}
          </div>

          <Link to="/classement">
            <button className="bg-primary text-black text-2xl font-bold rounded-full w-96 h-12 mt-4 shadow-lg hover:bg-red-600">Voir le classement</button>
          </Link>

        </div>
      )}

      {/* <hr className="border-gray-400 opacity-40 w-3/4 mx-auto mt-8 mb-8" /> */}

      {/* Newly opened routes  (2 latest roures) */}
      <div className="flex flex-col items-center gap-8 justify-center p-4 space-y-2 sm:space-x-4 mb-8 bg-[#626262] bg-opacity-20 rounded-xl">
        <h1 className="text-4xl"> Récemment ouvertes </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {routes?.length > 0 ? (
            routes.slice(0, 2).map((route, index) => (        
                <div key={index} className="relative sm:w-60 w-56 h-64 rounded-2xl overflow-hidden shadow-lg m-2">
                  <img src={route.img} alt={route.name} className="w-full h-full object-cover" />
                  <div className="absolute flex justify-between bottom-0 left-0 right-0 bg-[#808080] py-2 px-4">
                    <span className="text-lg sm:text-xl">{route.grade}</span>
                    <span className="text-lg sm:text-xl font-bold">{route.name}</span>
                    <span className="text-lg sm:text-xl">{route.difficultyPoints}</span>
                  </div>
                </div>
            ))
          ) : (
            <div className="text-lg sm:text-2xl mt-4">Pas de voies récemment ouvertes</div>
          )}

        </div>

        <Link to="/listevoies">
          <button className="bg-primary text-black text-2xl font-bold rounded-full w-96 h-12 mt-4 shadow-lg hover:bg-red-600">Voir toutes les voies</button>
        </Link>

      </div>


    </div>

  );
};

export default HomePage;
