import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useAddRoute = () => {
	const queryClient = useQueryClient();

	const addRouteMutation = useMutation({
		mutationFn: async (newRoute) => {
			const res = await fetch("/api/routes/addRoute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newRoute),
			});
			if (!res.ok) {
				throw new Error("Failed to add route");
			}
			return res.json();
		},
		onSuccess: () => {
			toast.success("Route added successfully");
			queryClient.invalidateQueries(["routes"]);
		},
	});

	return {
		addRoute: addRouteMutation.mutate,
		isAddingRoute: addRouteMutation.isLoading,
		addRouteSuccess: addRouteMutation.isSuccess,
	};
};

export default useAddRoute;
