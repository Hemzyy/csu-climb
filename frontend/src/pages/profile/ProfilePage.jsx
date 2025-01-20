import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdEdit } from 'react-icons/md';

import React from 'react';

import { formatMemberSinceDate } from '../../utils/date';
import useUpdateUserProfile from '../../hooks/useUpdateUserProfile';


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

    const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

    const isMyProfile = authUser._id === user?._id;
    const memberSinceDate = formatMemberSinceDate(user?.createdAt);

    useEffect(() => {
        refetch();
    }, [username, refetch]);

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                state === "profileImg" && setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

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
    //.slice(0, 4); // Only take the top 4 grades

    //endpoint to update the users visibility on the leaderboard
    const toggleVisibility = async () => {
        try {
            const res = await fetch(`/api/leaderboard/leaderboard-visibility/${user._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            refetch();
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white sm:gap-12 gap-5 sm:pt-16 mt-20 sm:pb-4 pb-20">

            <h1 className="text-3xl font-bold text-center">Profile</h1>

                {/* Profile Info */}
                <div className="flex-col sm:flex-row items-center justify-center sm:space-y-0 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8 motion-preset-slide-up">
                    <input
                        type="file"
                        hidden
                        accept='image/*'
                        ref={profileImgRef}
                        onChange={async (e) => handleImgChange(e, "profileImg")}
                    />
                    <div className="flex flex-col items-center text-center  motion-preset-pop motion-delay-300">
                        {/* edit pfp button */}
                        {isMyProfile && (
                            <div className=" absolute mt-1 ml-24 p-1 bg-primary rounded-full">

                                <MdEdit
                                    className="w-5 h-5 text-white"
                                    onClick={() => profileImgRef.current.click()}
                                />
                            </div>

                        )}
                        <img
                            src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                            alt="profile"
                            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
                        />

                        {(profileImg) && (
                            <button className="bg-primary text-white rounded-lg mt-2 px-2 py-1"
                                onClick={async () => {
                                    await updateProfile({ profileImg });
                                    setProfileImg(null);
                                }
                                }>
                                {isUpdatingProfile ? "Updating..." : "Save"}
                            </button>
                        )}

                        <span className="text-xl sm:text-3xl mt-2">{user?.username}</span>
                        <span className="text-sm sm:text-lg text-gray-400 mt-6">{memberSinceDate}</span>
                    </div>
                </div>

                {/* detailed? stats */}
                <div className="flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-20 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8 motion-preset-slide-up motion-delay-100">
                    <div className="flex justify-center items-center space-x-0">
                        {[{
                            icon: "/icons/podiumB.png",
                            value: user?.rank,
                            label: "Rang"
                        }, {
                            icon: "/icons/pointsB.png",
                            value: user?.leaderboardScore,
                            label: "Points"
                        }, {
                            icon: "/icons/climbingB.png",
                            value: user?.climbedRoutes.length,
                            label: "Voies"
                        }].map(({ icon, value, label }, index, array) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center text-center motion-preset-slide-up motion-delay-500">
                                    <div className="flex flex-col h-16 w-24 sm:h-24 sm:w-40 rounded-3xl items-center justify-center mt-8">
                                        <img src={icon} alt={label} className="w-7 h-7 sm:w-10 sm:h-10" />
                                        <span className="text-white font-bold text-2xl sm:text-4xl">{value}</span>
                                        <span className="mt-2 text-lg sm:text-2xl">{label}</span>
                                    </div>

                                </div>
                                {/* Divider Line */}
                                {index < array.length - 1 && (
                                    <div className="h-16 sm:h-24 w-px bg-gray-400 opacity-50"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* The highest grades user climbed and their count in a horizontal wrapping layout */}
                    <div className="flex justify-center items-center">
                        <div className="flex flex-wrap gap-4 mt-4 justify-center">
                            {sortedClimbedRoutes?.map(({ grade, count }) => (
                                <div key={grade} className="flex flex-col items-center p-2 w-24 border rounded-md">
                                    <span className="text-lg sm:text-4xl">{grade}</span>
                                    <span className="text-sm sm:text-lg text-gray-400">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Leaderboard Visibility */}
                {/* Add toggle for leaderboard visibility */}
                {isMyProfile && (
                    <div className="flex justify-center items-center bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8 motion-preset-slide-up motion-delay-200">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-xl sm:text-3xl">Visibilité dans le classement</span>
                            <span className="text-sm sm:text-lg text-gray-400 mt-2">Cliquez pour changer la visibilité</span>
                            <button
                                className={`mt-4 px-4 py-2 rounded-lg ${user?.showOnLeaderboard ? "bg-primary" : "bg-gray-400"}`}
                                onClick={toggleVisibility}
                            >
                                {user?.showOnLeaderboard ? "Visible" : "non visible"}
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </>
    )
}

export default ProfilePage;