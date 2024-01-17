import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditContainer } from "../../services/apiContainers";
import toast from "react-hot-toast";

export function useCreateContainer() {
  const queryClient = useQueryClient();

  const { mutate: createContainer, isLoading: isCreating } = useMutation({
    mutationFn: createEditContainer,
    onSuccess: () => {
      toast.success("New container successfully created");
      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createContainer };
}
