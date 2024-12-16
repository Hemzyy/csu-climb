import React from "react";

const HomePage = () => {
  // Hardcoded data for demonstration
  const user = {
    avatar: "https://via.placeholder.com/100", // Replace with the actual image URL
    username: "ClimbingPro",
    rank: 42,
    points: 1280,
    highestRoutes: [
      { grade: "7a", count: 12 },
      { grade: "6c", count: 8 },
      { grade: "6b", count: 5 },
      { grade: "6a", count: 3 },
    ],
  };

  const topUsers = [
    { avatar: "https://via.placeholder.com/80", username: "GoldUser", rank: 1 },
    { avatar: "https://via.placeholder.com/70", username: "SilverUser", rank: 2 },
    { avatar: "https://via.placeholder.com/70", username: "BronzeUser", rank: 3 },
    // Users for rank 4 to 10
    { username: "User4", rank: 4, points: 950 },
    { username: "User5", rank: 5, points: 920 },
    { username: "User6", rank: 6, points: 890 },
    { username: "User7", rank: 7, points: 870 },
    { username: "User8", rank: 8, points: 850 },
    { username: "User9", rank: 9, points: 820 },
    { username: "User10", rank: 10, points: 800 },
  ];

  return (
    <div className="flex justify-center w-screen min-h-screen bg-[#1D232A]">
      <div className="flex flex-col gap-y-20 w-[50%] items-center h-screen">
        {/* Main user stats section */}
        <div className="mt-10 bg-[#2E4259] shadow-lg rounded-lg p-6 flex flex-col w-[100%] h-[40%]">
          <div className="text-center">VOS STATISTIQUES</div>
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
              <div className="text-2xl font-bold text-wite">
                Rank: <span className="text-white">{user.rank}</span>
              </div>
              <div className="text-2xl font-bold text-white">
                Points: <span className="text-white">{user.points}</span>
              </div>
            </div>
            {/* Highest routes */}
            <div className="grid grid-cols-2 gap-4 justify-center pr-6 ml-0">
              {user.highestRoutes.map((route, index) => (
                <div
                  key={index}
                  className="bg-[#2E4259] p-2 w-24 h-14 rounded-lg text-center shadow-md"
                >
                  <span className="font-bold text-white">{route.grade}</span>
                  <span className="block text-white">{route.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard section */}
        <div className="w-full flex flex-col items-center bg-[#2E4259] p-2 rounded-lg">
          <div className="text-center p-5">TOP 10</div>
          {/* Top 3 users */}
          <div className="flex justify-center gap-20 items-end mb-6 w-[90%] bg-[#2C3540] p-4 rounded-lg">
            <div className="flex flex-col items-center relative">
              <img
                src={topUsers[1].avatar}
                alt="Silver"
                className="w-16 h-16 rounded-full border-2 border-silver"
              />
              <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-sm rounded-full px-2">
                2
              </span>
              <div className="text-white">{topUsers[1].username}</div>
            </div>
            <div className="flex flex-col items-center relative">
              <img
                src={topUsers[0].avatar}
                alt="Gold"
                className="w-20 h-20 rounded-full border-2 border-gold"
              />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-sm rounded-full px-2">
                1
              </span>
              <div className="text-white">{topUsers[0].username}</div>
            </div>
            <div className="flex flex-col items-center relative">
              <img
                src={topUsers[2].avatar}
                alt="Bronze"
                className="w-16 h-16 rounded-full border-2 border-bronze"
              />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm rounded-full px-2">
                3
              </span>
              <div className="text-white">{topUsers[2].username}</div>
            </div>
          </div>

          {/* Rank 4-10 leaderboard */}
          <div className="w-[90%] bg-[#2E4259] p-4 rounded-lg">
            {topUsers.slice(3).map((user, index) => (
              <div
                key={user.rank}
                className="flex justify-between items-center p-2 pl-5 pr-5 bg-[#2C3540] rounded-full mb-2 text-white"
              >
                <div className="flex items-center gap-x-4">
                  <span className="text-lg">{user.rank}</span>
                  <img
                    src={user.avatar || "https://via.placeholder.com/50"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
                <span className="text-md">{user.points} pts</span>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-[#2E4259] text-white p-2 rounded-lg mt-4">
          Voir le classement complet
        </button>
      </div>
    </div>
  );
};

export default HomePage;
