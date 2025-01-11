import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useValidateRoute = () => {
  const queryClient = useQueryClient();

  const validateRouteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`https://csu-climb.onrender.comroutes/validate/${id}`, {
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
    }
  });

  return validateRouteMutation;
};

export default useValidateRoute;