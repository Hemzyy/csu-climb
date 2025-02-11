import { useEffect, useState } from "react";
import useEditRoute from "../../hooks/useEditRoute";    
import { IoEllipsisVertical } from "react-icons/io5"; // Icon for the dropdown button
import { useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';

const AdminToolsDropdown = ({ route }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {mutate:deleteRoute, isPending:isDeleting} = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/routes/${route._id}`, {
                    method: 'DELETE',
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Something went wrong!');
                }
                return data;

            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
			toast.success("Route deleted successfully");
			//invalidate the query to refetch the data
			queryClient.invalidateQueries({ queryKey: ['routes'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
		},
    })

    const handleDeletePost = () => {
        if (isDeleting) return;
        deleteRoute();
    }

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleEditClick = () => {
        setIsDropdownOpen(false); // Close dropdown
        setIsEditModalOpen(true); // Open edit modal
    };

    const handleArchiveClick = () => {
        setIsDropdownOpen(false); // Close dropdown
        // Logic for archiving the route
        console.log("Archiving route:", route.name);
    };

    const handleDeleteClick = () => {
        setIsDropdownOpen(false); // Close dropdown
        // Logic for deleting the route
        handleDeletePost();
    };

    return (
        <div className="absolute top-2 right-2">
            {/* Dropdown Trigger */}
            <button
                className="btn btn-primary rounded-full btn-sm"
                onClick={toggleDropdown}
            >
                <IoEllipsisVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                            onClick={handleArchiveClick}
                        >
                            Archive
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Route Modal */}
            {isEditModalOpen && (
                <EditRouteModal
                    route={route}
                    onClose={() => setIsEditModalOpen(false)} // Close the modal
                />
            )}
        </div>
    );
};

const EditRouteModal = ({ route, onClose }) => {
    const [formData, setFormData] = useState({
        routeId: route._id,
        name: route.name,
        grade: route.grade,
        difficultyPoints: route.difficultyPoints,
        sector: route.sector,
        img: route.img || '', // Include a default image or leave empty
    });

    const { editRoute, isEditingRoute } = useEditRoute();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <>
            {/* <button
                className='btn btn-primary rounded-full btn-sm absolute top-2 right-2'
                onClick={() => document.getElementById("edit_route_modal").showModal()}
            >
                Edit Route
            </button> */}
            <dialog open className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md text-slate-200'>
                    <div className="flex justify-between">
                        <h3 className='font-bold text-lg my-3'>Edit Route</h3>
                        <button
                            className="btn btn-sm btn-[#535353] mt-2"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            editRoute(formData);
                        }}
                    >
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Route name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.name}
                                name='name'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Grade'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.grade}
                                name='grade'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Points'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.difficultyPoints}
                                name='difficultyPoints'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Sector'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.sector}
                                name='sector'
                                onChange={handleInputChange}
                            />
                        </div>
                        <button
                            className='btn btn-primary w-full'
                            disabled={isEditingRoute}
                        >
                            {isEditingRoute ? 'Editing...' : 'Edit Route'}
                        </button>
                    </form>
                    {/* <button
                        className="btn btn-sm btn-[#535353] mt-2"
                        onClick={onClose}
                    >
                        Close
                    </button> */}
                </div>
            </dialog>
        </>
    );
}

export default AdminToolsDropdown;