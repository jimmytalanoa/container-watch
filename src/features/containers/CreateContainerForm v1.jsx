import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContainer } from "../../services/apiContainers";
import toast from "react-hot-toast";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";

function CreateContainerForm() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createContainer,
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
    // mutate(data);

    console.log(data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Container #" error={errors?.containerNumber?.message}>
        <Input
          type="text"
          id="containerNumber"
          {...register("containerNumber", {
            required: "This field is required",
          })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Size" error={errors?.size?.message}>
        <Input
          type="number"
          id="size"
          {...register("size", { required: "This field is required" })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="AQIS Entry" error={errors?.aqisentry?.message}>
        <Input
          type="text"
          id="aqisEntry"
          {...register("aqisEntry")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Vessel" error={errors?.vessel?.message}>
        <Input
          type="text"
          id="vessel"
          {...register("vessel")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Wharf" error={errors?.wharf?.message}>
        <Input
          type="text"
          id="wharf"
          {...register("wharf")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Site Location" error={errors?.siteLocation?.message}>
        <Input
          type="text"
          id="siteLocation"
          {...register("siteLocation")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Product" error={errors?.product?.message}>
        <Input
          type="text"
          id="product"
          {...register("product")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="EIDO" error={errors?.product?.message}>
        <FileInput
          id="iamge"
          accept="image/*"
          {...register("eido")}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add container</Button>
      </FormRow>
    </Form>
  );
}

export default CreateContainerForm;
