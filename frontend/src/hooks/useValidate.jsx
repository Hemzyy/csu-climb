import { useMutation, useQueryClient } from '@tanstack/react-query';

const useValidateRoute = () => {
  const queryClient = useQueryClient();

  const validateRouteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/routes/validate/${id}`, {
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
      queryClient.invalidateQueries(["authUser"]);
      queryClient.invalidateQueries(["voie"]);
    }
  });

  return validateRouteMutation;
};

export default useValidateRoute;