import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { createEditContainer } from "../../services/apiContainers";
import toast from "react-hot-toast";

function CreateContainerForm({ containerToEdit = {} }) {
  const { id: editId, ...editValues } = containerToEdit;
  const isEditSession = Boolean(editId);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createEditContainer,
    onSuccess: () => {
      toast.success("New container successfully created");
      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    mutate({ ...data, eido: data.eido[0] });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow
        label="Container #"
        error={errors?.containerNumber?.message}
        disabled={isCreating}
      >
        <Input
          type="text"
          id="containerNumber"
          {...register("containerNumber", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Size" error={errors?.size?.message} disabled={isCreating}>
        <Input
          type="number"
          id="size"
          {...register("size", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow
        label="AQIS Entry"
        error={errors?.aqisentry?.message}
        disabled={isCreating}
      >
        <Input type="text" id="aqisEntry" {...register("aqisEntry")} />
      </FormRow>

      <FormRow
        label="Vessel"
        error={errors?.vessel?.message}
        disabled={isCreating}
      >
        <Input type="text" id="vessel" {...register("vessel")} />
      </FormRow>

      <FormRow
        label="Wharf"
        error={errors?.wharf?.message}
        disabled={isCreating}
      >
        <Input type="text" id="wharf" {...register("wharf")} />
      </FormRow>

      <FormRow
        label="Site Location"
        error={errors?.siteLocation?.message}
        disabled={isCreating}
      >
        <Input type="text" id="siteLocation" {...register("siteLocation")} />
      </FormRow>

      <FormRow
        label="Product"
        error={errors?.product?.message}
        disabled={isCreating}
      >
        <Input type="text" id="product" {...register("product")} />
      </FormRow>

      <FormRow label="EIDO" error={errors?.eido?.message} disabled={isCreating}>
        <FileInput type="file" id="eido" {...register("eido")} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isCreating}>
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isEditSession ? "Edit container" : "Add container"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateContainerForm;
