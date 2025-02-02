import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdEdit } from 'react-icons/md';
import { formatMemberSinceDate } from '../../utils/date';
import EditProfileModal from "./EditProfileModal";
import React from 'react';

const ProfilePage = () => {
    const [profileImg, setProfileImg] = useState(null);
    const profileImgRef = useRef();
    const { username } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    // Fetch user profile data
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    // Fetch user's climbed routes (grouped by grade)
    const { data: climbedRoutes, isLoading: climbedRoutesLoading } = useQuery({
        queryKey: ["climbedRoutes"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/climbedRoutes/${username}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    // Fetch full route details for each climbed route
    const { data: routes, isLoading: routesLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/routes");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    // Get full route objects for the user's climbed routes
    const fullClimbedRoutes = user?.climbedRoutes
        ?.map((routeId) => routes?.find((route) => route._id === routeId))
        .filter((route) => route); // Filter out undefined values

    // Sort climbed routes by grade (highest to lowest)
    const sortedClimbedRoutes = fullClimbedRoutes?.sort((a, b) => {
        const parseGrade = (grade) => {
            const regex = /^(\d+)([a-c]?)(\+?)$/;
            const match = grade.match(regex);
            if (!match) return [0, "", ""]; // Default for unrecognized formats
            const [, number, letter, plus] = match;
            return [parseInt(number, 10), letter || "", plus || ""];
        };

        const [numA, letterA, plusA] = parseGrade(a.grade);
        const [numB, letterB, plusB] = parseGrade(b.grade);

        if (numA !== numB) return numB - numA; // Sort by number descending
        if (letterA !== letterB) {
            const gradeOrder = ["a", "b", "c"];
            return gradeOrder.indexOf(letterB) - gradeOrder.indexOf(letterA); // Sort by letter descending
        }
        return plusB.length - plusA.length; // "+" grades come last
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const displayedRoutes = isExpanded ? sortedClimbedRoutes : sortedClimbedRoutes?.slice(0, 4);


    // Handle profile image change
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImg(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Toggle leaderboard visibility
    const toggleVisibility = async () => {
        try {
            const res = await fetch(`/api/leaderboard/leaderboard-visibility/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    const isMyProfile = authUser?._id === user?._id;
    const memberSinceDate = formatMemberSinceDate(user?.createdAt);

    return (
        <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-5 sm:pt-16 mt-20 sm:pb-4 pb-20">
            <h1 className="text-3xl font-bold text-center">Profile</h1>

            {/* Profile Info */}
            <div className="flex-col sm:flex-row items-center justify-center sm:space-y-0 sm:space-x-0 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8 motion-preset-slide-up">
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={profileImgRef}
                    onChange={handleImgChange}
                />
                <div className="flex flex-col items-center text-center motion-preset-pop motion-delay-300">
                    {isMyProfile && (
                        <div className="absolute mt-1 ml-24 p-1 bg-primary rounded-full">
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
                    {profileImg && (
                        <button
                            className="bg-primary text-white rounded-lg mt-2 px-2 py-1"
                            onClick={async () => {
                                await updateProfile({ profileImg });
                                setProfileImg(null);
                            }}
                        >
                            {isUpdatingProfile ? "Updating..." : "Save"}
                        </button>
                    )}
                    <span className="text-xl sm:text-3xl mt-2">{user?.username}</span>
                    <span className="text-sm sm:text-lg text-gray-400 mt-6">{memberSinceDate}</span>

                    {/*Edit Profile Button */}
                    {isMyProfile && <EditProfileModal authUser={authUser} />}

                    {/* {isMyProfile && (
                        <button
                            className="bg-primary text-white rounded-lg px-4 py-2 mt-4"
                            onClick={() => history.push("/edit-profile")}
                        >
                            Edit Profile
                        </button>
                    )} */}

                </div>
            </div>

            {/* Validated Routes Section */}
            <div className="bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8 motion-preset-slide-up motion-delay-100">

                {/*stats*/}
                <div className="flex justify-center items-center space-x-0 pb-9">
                    {[{
                        icon: "/icons/podiumB.png",
                        value: user?.showOnLeaderboard ? user?.rank : "N/A",
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

                <hr className="border-gray-400 opacity-40 w-3/4 mx-auto mt-4 mb-4" />


                <h2 className="text-2xl font-bold mb-4 text-center">Voies Validées</h2>

                {/* Centered List Container */}
                <div className="flex flex-col items-center"> {/* Center the list horizontally */}
                    <div className="flex flex-col gap-2 sm:w-[40%] w-full"> {/* Adjust width as needed */}
                        {displayedRoutes?.map((route) => (
                            <div
                                key={route._id}
                                className="bg-[#808080] rounded-lg shadow-md overflow-hidden relative transition-opacity p-2 w-full"
                            >
                                <div className="flex justify-between items-center"> {/* Align items vertically */}
                                    {/* Left Section */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-9 h-9 bg-gray-400 flex items-center justify-center rounded-full">
                                            <img
                                                src={route.img || "/route-img-placeholder.png"}
                                                alt={route.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <span>{route.name}</span>
                                    </div>

                                    {/* Right Section */}
                                    <div className="grid grid-cols-[auto_auto] gap-4 items-center mr-2">
                                        {/* Grade */}
                                        <span className="w-16 text-right">{route.grade}</span> {/* Fixed width for grade */}
                                        {/* Points */}
                                        <span className="w-6 text-right">{route.difficultyPoints}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Expand/Collapse Button */}
                    {sortedClimbedRoutes?.length > 4 && (
                        <button
                            className="mt-4 px-4 py-2 rounded-lg bg-primary text-white"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Voir moins" : "Voir plus"}
                        </button>
                    )}

                </div>
            </div>

            {/* Leaderboard Visibility */}
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
    );
};

export default ProfilePage;