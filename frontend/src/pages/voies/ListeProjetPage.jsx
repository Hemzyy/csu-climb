import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";


const ProjectsPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: routes, isLoading } = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const res = await fetch("/api/routes");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
    });

    // State for filters and sorting
    const [filterGrade, setFilterGrade] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
    const [sortField, setSortField] = useState("difficultyPoints"); // Default sorting by points


    // Filter and sort projects
    const filteredAndSortedProjects = authUser?.projects
        ?.filter((project) => (filterGrade ? project.grade === filterGrade : true))
        ?.sort((a, b) => {
            const comparison =
                sortField === "difficultyPoints"
                    ? a.difficultyPoints - b.difficultyPoints
                    : a.grade.localeCompare(b.grade);
            return sortOrder === "asc" ? comparison : -comparison;
        });

    const handleFilterChange = (e) => {
        setFilterGrade(e.target.value);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="flex flex-col justify-center w-full sm:w-[75%] max-w-6xl mx-auto min-h-screen text-white gap-5 pt-[5rem] sm:pb-0 pb-20">
            <h1 className="text-3xl font-bold text-center">Mes Projects</h1>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap justify-center gap-2 p-2 sm:justify-between sm:flex-nowrap">
                <button
                    onClick={() => handleSortChange("difficultyPoints")}
                    className="bg-gray-700 text-white rounded px-2 py-1"
                >
                    Trier par points ({sortOrder === "asc" ? "↑" : "↓"})
                </button>
                <button
                    onClick={() => handleSortChange("grade")}
                    className="bg-gray-700 text-white rounded px-2 py-1"
                >
                    Trier par niveau ({sortOrder === "asc" ? "↑" : "↓"})
                </button>
                <button
                    onClick={() => handleSortChange("createdAt")}
                    className="bg-gray-700 text-white rounded px-2 py-1"
                >
                    Trier par date ({sortOrder === "asc" ? "↑" : "↓"})
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:mx-0 mx-20 bg-[#626262] bg-opacity-20 rounded-xl py-6 px-8">
                {isLoading ? (
                    <div className="text-white text-center col-span-full">Loading...</div>
                ) :
                    filteredAndSortedProjects && filteredAndSortedProjects.length > 0 ? (
                        filteredAndSortedProjects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-[#808080] rounded-lg shadow-md overflow-hidden relative hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <div className="w-full sm:h-44 h-72 bg-gray-400 flex items-center justify-center">
                                    <img
                                        src={project.img || "/route-img-placeholder.png"}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="px-4 pb-2 text-gray-200 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold">{project.name}</h2>
                                        <p className="text-sm text-gray-200">
                                            <strong>Grade:</strong> {project.grade}
                                        </p>
                                        <p className="text-sm text-gray-200">
                                            <strong>Points:</strong> {project.difficultyPoints}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-white text-center col-span-full">
                            No projects available
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ProjectsPage;
