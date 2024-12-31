import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { formatMemberSinceDate } from '../../utils/date';


const ProfilePage = () => {
    const [profileImg, setProfileImg] = useState(null);

    const profileImgRef = useRef();

    const { username } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: user, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
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

    const isMyProfile = authUser._id === user?._id;
    const memberSinceDate = formatMemberSinceDate(user?.createdAt);

    useEffect(() => {
        refetch();
    }, [username, refetch]);
    
    const { data: climbedRoutes, isLoading: climbedRoutesLoading } = useQuery({
        queryKey: ["climbedRoutes"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/climbedRoutes/${username}`);
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

    const sortedClimbedRoutes = climbedRoutes?.grades
    .sort((a, b) => {
        const gradeOrder = ["a", "b", "c"];
        const [gradeA, gradeB] = [a.grade, b.grade];
        const [letterA, letterB] = [gradeA.slice(-1), gradeB.slice(-1)];
        const [numA, numB] = [parseInt(gradeA, 10), parseInt(gradeB, 10)];

        if (numA !== numB) {
            return numB - numA; // Sort by number descending
        }
        return gradeOrder.indexOf(letterB) - gradeOrder.indexOf(letterA); // Sort by letter descending
    })
    .slice(0, 4); // Only take the top 4 grades


    return (
        <>
            <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-12">

                {/* Profile Info */}
                <div className="flex-col sm:flex-row items-center justify-center sm:space-y-0 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                            alt="profile"
                            className="w-24 h-24 sm:w-36 sm:h-36 rounded-full"
                        />
                        <span className="text-xl sm:text-3xl mt-2">{user?.username}</span>
                        <span className="text-sm sm:text-lg text-gray-400 mt-6">{memberSinceDate}</span>
                    </div>
                </div>

                {/* detailed? stats */}
                <div className="flex-col sm:flex-row items-center justify-center sm:space-y-20 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
                    <div className="flex justify-center items-center space-x-0">
                        {[{
                            icon: "/icons/podium.png",
                            value: user?.rank,
                            label: "Rang"
                        }, {
                            icon: "/icons/points.png",
                            value: user?.leaderboardScore,
                            label: "Points"
                        }, {
                            icon: "/icons/climbing.png",
                            value: user?.climbedRoutes.length,
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

                    {/* the highest grades user climed and their count in a grid */}
                    <div className="flex justify-center items-center">
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {sortedClimbedRoutes?.map(({ grade, count }) => (
                                <div key={grade} className="flex flex-col items-center">
                                    <span className="text-lg sm:text-2xl font-bold">{grade}</span>
                                    <span className="text-sm sm:text-lg text-gray-400">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default ProfilePage;