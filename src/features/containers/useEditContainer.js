import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditContainer } from "../../services/apiContainers";
import toast from "react-hot-toast";

export function useEditContainer() {
  const queryClient = useQueryClient();

  const { mutate: editContainer, isLoading: isEditing } = useMutation({
    mutationFn: ({ newContainerData, id }) =>
      createEditContainer(newContainerData, id),
    onSuccess: () => {
      toast.success("Container successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editContainer };
}
