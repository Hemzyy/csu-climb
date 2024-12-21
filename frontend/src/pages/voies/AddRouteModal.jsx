import { useEffect, useState } from "react";
import useAddRoute from "../../hooks/useAddRoute";

const AddRouteModal = () => {
	const [formData, setFormData] = useState({
		name: "",
		grade: "",
		difficultyPoints: "",
		setter: "",
	});

	
	const { addRoute, isAddingRoute } = useAddRoute();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });

	}

	return (
		<>
			<button
				className='btn btn-outline btn-sm h-[230px]'
				onClick={() => document.getElementById("add_route_modal").showModal()}
			>
				Add Route
			</button>
			<dialog id='add_route_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md text-slate-200'>
					<h3 className='font-bold text-lg my-3'>Add Route</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							addRoute(formData);
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
                                value={formData.points}
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
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isAddingRoute ? "Adding..." : "Add Route"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default AddRouteModal;