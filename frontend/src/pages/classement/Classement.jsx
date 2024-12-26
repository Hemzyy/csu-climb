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
    <div className="bg-custom-bg bg-fixed bg-center flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen pt-16 text-white mt-20 gap-12">
      <h1 className="text-4xl font-bold text-center">Classement</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Top 3</h2>
          <div className="flex flex-col items-center gap-4">
            {topThree.map((user, index) => (
              <div key={user.id} className="flex flex-col items-center gap-2">
                <p className="text-lg">
                  {index + 1}. {user.username}
                </p>
                <p className="text-lg">{user.points} points</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Reste du classement</h2>
          <div className="flex flex-col items-center gap-4">
            {restOfList.map((user, index) => (
              <div key={user.id} className="flex flex-col items-center gap-2">
                <p className="text-lg">
                  {index + 4}. {user.username}
                </p>
                <p className="text-lg">{user.points} points</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classement;
