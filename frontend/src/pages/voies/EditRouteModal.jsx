import { useEffect, useState } from "react";
import useEditRoute from "../../hooks/useEditRoute";

const EditRouteModal = ({ route }) => {
    const [formData, setFormData] = useState({
        routeId: route._id,
        name: route.name,
        grade: route.grade,
        difficultyPoints: route.difficultyPoints,
        setter: route.setter,
        img: route.img || '', // Include a default image or leave empty
    });

    const { editRoute, isEditingRoute } = useEditRoute();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <>
            <button
                className='btn btn-primary rounded-full btn-sm absolute top-2 right-2'
                onClick={() => document.getElementById("edit_route_modal").showModal()}
            >
                Edit Route
            </button>
            <dialog id='edit_route_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md text-slate-200'>
                    <h3 className='font-bold text-lg my-3'>Edit Route</h3>
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
                                placeholder='Setter'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.setter}
                                name='setter'
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
                </div>
            </dialog>
        </>
    );
}

export default EditRouteModal;