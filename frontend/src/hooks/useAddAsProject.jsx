import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useAddAsProject = () => {
    const queryClient = useQueryClient();
    
    const addAsProjectMutation = useMutation({
        mutationFn: async (id) => {
        try {
            const res = await fetch(`https://csu-climb.onrender.comroutes/addAsProject/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
            throw new Error("Something went wrong");
            }
            return await res.json();
        } catch (error) {
            throw new Error(error.message);
        }
        },
        onSuccess: () => {
            toast.success("success");
            queryClient.invalidateQueries(["authUser"]);
            queryClient.invalidateQueries(["voie"]);
            queryClient.refetchQueries(["authUser"]);
        }
    });
    
    return addAsProjectMutation;
};

export default useAddAsProject;