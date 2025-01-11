import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useEditRoute = () => {
    const queryClient = useQueryClient();
    
    const editRouteMutation = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await fetch('https://csu-climb.onrender.comroutes/editRoute', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;                
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("routes");
            queryClient.invalidateQueries("route");
            toast.success("Route edited successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        editRoute: editRouteMutation.mutate,
        isEditingRoute: editRouteMutation.isLoading,
        editRouteSuccess: editRouteMutation.isSuccess,
    };
}

export default useEditRoute;