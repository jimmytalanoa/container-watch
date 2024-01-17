import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContainer as deleteContainerApi } from "../../services/apiContainers";
import toast from "react-hot-toast";

export function useDeleteContainer() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteContainer } = useMutation({
    mutationFn: deleteContainerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
      toast.success("Container successfully deleted");
    },
    onError: () => {
      toast.error("Container could not be deleted");
    },
  });

  return { isDeleting, deleteContainer };
}
