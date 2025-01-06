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

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  
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
    <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-4">

      <h1 className="text-3xl font-bold text-center mt-4">Classement</h1>

      {/* Top 3 */}
      <div className="sm:flex justify-center gap-2 mt-14">

        {/* 1st place */}
        {topThree[0]?.leaderboardScore > 0 && (
          <div className="flex flex-col bg-[#626262] bg-opacity-20 sm:w-1/3 w-full sm:mb-0 mb-2 rounded-xl p-2">
            <div className="flex-col sm:flex-row items-center justify-center sm:justify-evenly sm:space-y-5 sm:space-x-0 space-y-4">
              {/* User image and username */}
              <div className="flex sm:justify-around justify-center items-center text-center gap-4">
                <img
                  src={topThree[0]?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mt-5"
                />
                <span className="text-xl sm:text-2xl mt-2">{topThree[0]?.username}</span>

              </div>
              {/* Stats */}
              <div className="flex justify-center sm:gap-4">
                <div className="flex justify-center sm:gap-6">
                  {[{
                    icon: "/icons/podiumB.png",
                    value: topThree[0].rank,
                    label: "Rang"
                  }, {
                    icon: "/icons/pointsB.png",
                    value: topThree[0].leaderboardScore,
                    label: "Points"
                  }, {
                    icon: "/icons/climbingB.png",
                    value: topThree[0].climbedRoutes.length,
                    label: "Voies"
                  }].map(({ icon, value, label }, index, array) => (
                    <React.Fragment key={index}>
                      {/* Stat Block */}
                      <div className="flex flex-col items-center text-center pb-2">
                        <img src={icon} alt="icon" className="w-8 h-8 sm:w-7 sm:h-7"/>
                        <div className="flex flex-col justify-around sm:h-12 sm:w-10 rounded-2xl items-center">
                          <span className="text-[#FFD700] font-bold text-1xl sm:text-2xl">{value}</span>
                          <span className="text-lg text-gray-500 sm:text-1xl mx-4">{label}</span>
                        </div>
                      </div>
                      {/* Vertical Line */}
                      {index < array.length - 1 && (
                        <div className="h-full w-px bg-gray-400 opacity-50"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2nd place */}
        {topThree[1]?.leaderboardScore > 0 && (
          <div className="flex flex-col bg-[#626262] bg-opacity-20 sm:w-1/3 w-full sm:mb-0 mb-2 rounded-xl p-2">
            <div className="flex-col sm:flex-row items-center justify-center sm:justify-evenly sm:space-y-5 sm:space-x-0 space-y-4">
              {/* User image and username */}
              <div className="flex sm:justify-around justify-center items-center text-center gap-4">
                <img
                  src={topThree[1]?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mt-5"
                />
                <span className="text-xl sm:text-2xl mt-2">{topThree[1]?.username}</span>

              </div>
              {/* Stats */}
              <div className="flex justify-center sm:gap-4">
                <div className="flex justify-center sm:gap-6">
                  {[{
                    icon: "/icons/podiumB.png",
                    value: topThree[1].rank,
                    label: "Rang"
                  }, {
                    icon: "/icons/pointsB.png",
                    value: topThree[1].leaderboardScore,
                    label: "Points"
                  }, {
                    icon: "/icons/climbingB.png",
                    value: topThree[1].climbedRoutes.length,
                    label: "Voies"
                  }].map(({ icon, value, label }, index, array) => (
                    <React.Fragment key={index}>
                      {/* Stat Block */}
                      <div className="flex flex-col items-center text-center">
                        <img src={icon} alt="icon" className="w-8 h-8 sm:w-7 sm:h-7"/>
                        <div className="flex flex-col justify-around sm:h-12 sm:w-10 rounded-2xl items-center">
                          <span className="text-[#C0C0C0] font-bold text-1xl sm:text-2xl">{value}</span>
                          <span className="text-lg text-gray-500 sm:text-1xl mx-4">{label}</span>
                        </div>
                      </div>
                      {/* Vertical Line */}
                      {index < array.length - 1 && (
                        <div className="h-full w-px bg-gray-400 opacity-50"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3rd place */}
        {topThree[2]?.leaderboardScore > 0 && (
          <div className="flex flex-col bg-[#626262] bg-opacity-20 sm:w-1/3 w-full sm:mb-0 mb-2 rounded-xl p-2">
            <div className="flex-col sm:flex-row items-center justify-center sm:justify-evenly sm:space-y-5 sm:space-x- space-y-4">
              {/* User image and username */}
              <div className="flex sm:justify-around justify-center items-center text-center gap-4">
                <img
                  src={topThree[2]?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mt-5"
                />
                <span className="text-xl sm:text-2xl mt-2">{topThree[2]?.username}</span>

              </div>
              {/* Stats */}
              <div className="flex justify-center sm:gap-0">
                <div className="flex justify-center sm:gap-6">
                  {[{
                    icon: "/icons/podiumB.png",
                    value: topThree[2].rank,
                    label: "Rang"
                  }, {
                    icon: "/icons/pointsB.png",
                    value: topThree[2].leaderboardScore,
                    label: "Points"
                  }, {
                    icon: "/icons/climbingB.png",
                    value: topThree[2].climbedRoutes.length,
                    label: "Voies"
                  }].map(({ icon, value, label }, index, array) => (
                    <React.Fragment key={index}>
                      {/* Stat Block */}
                      <div className="flex flex-col items-center text-center">
                        <img src={icon} alt="icon" className="w-8 h-8 sm:w-7 sm:h-7"/>
                        <div className="flex flex-col justify-around sm:h-12 sm:w-10 rounded-2xl items-center">
                          <span className="text-[#cd7f32] font-bold text-1xl sm:text-2xl">{value}</span>
                          <span className="text-lg text-gray-500 sm:text-1xl mx-4">{label}</span>
                        </div>
                      </div>
                      {/* Vertical Line */}
                      {index < array.length - 1 && (
                        <div className="h-full w-px bg-gray-400 opacity-50"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>


            </div>
          </div>
        )}


      </div>

      {/* Rest of list */}
      <div className="flex flex-col gap-4 bg-[#626262] bg-opacity-20 py-4 sm:px-20 rounded-xl">
        {/*if rest of list is empty*/}
        {restOfList.length === 0 && (
          <div className="text-center text-lg">Aucun autre grimpeur n'a encore validé de voie</div>
        )}
        {/*if rest of list is not empty*/}
        {restOfList.map((user, index) => (
          <div key={index} className="flex flex-col justify-center">
            <div className={`flex justify-between items-center ${user.username === authUser?.username ? "text-[#FE5F55]" : ""}`}>            

              <div className="flex items-center gap-8">
                <span className="text-center w-14 text-xl">{user.rank}</span>
                <img
                  src={user.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />
                <span>{user.username}</span>
              </div>
              <span className="mr-7 text-lg">{user.leaderboardScore}</span>

            </div>
            <hr className="border-gray-400 opacity-20 w-full mt-3" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Classement;
