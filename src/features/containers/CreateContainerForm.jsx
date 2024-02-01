import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { Input } from "../../ui/Input";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { useCreateContainer } from "./useCreateContainer";
import { useEditContainer } from "./useEditContainer";

function CreateContainerForm({ containerToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = containerToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: isEditSession
      ? editValues
      : {
          bio: false,
          ifip: false,
        },
  });
  const { isCreating, createContainer } = useCreateContainer();
  const { isEditing, editContainer } = useEditContainer();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const file = typeof data.file === "string" ? data.file : data.file[0];
    if (isEditSession)
      editContainer(
        { newContainerData: { ...data, file: file }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createContainer(
        { ...data, file: file },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    console.log(errors);
  }

  const [bioField, ifipField, aqisField] = watch(["bio", "ifip", "aqisEntry"]);
  console.log(bioField, ifipField, aqisField);

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      {/* <FormRow label="Client">
        <select
          id="client"
          {...register("client", {
            required: "This field is required",
          })}
        >
          <option value="test">TEST</option>
        </select>
      </FormRow> */}
      <FormRow
        label="Container #"
        error={errors?.containerNumber?.message}
        disabled={isWorking}
      >
        <Input
          type="text"
          id="containerNumber"
          {...register("containerNumber", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Cargo Type">
        <select {...register("cargoType")}>
          <option value="GENERAL">GENERAL</option>
          <option value="REEFER">REEFER</option>
          <option value="OTHER">OTHER</option>
        </select>
      </FormRow>
      <FormRow label="Size" error={errors?.size?.message} disabled={isWorking}>
        <select {...register("size", { required: "This field is required" })}>
          <option value="20">20</option>
          <option value="40">40</option>
        </select>
      </FormRow>
      <FormRow label="ETA">
        <Input
          type="datetime-local"
          id="etaAvailaibility"
          {...register("etaAvailability")}
        />
      </FormRow>
      <FormRow label="P/U Timeslot">
        <Input type="datetime-local" id="timeslot" {...register("timeslot")} />
      </FormRow>

      <FormRow
        label="AQIS Entry"
        error={errors?.aqisentry?.message}
        disabled={isWorking}
      >
        <Input type="text" id="aqisEntry" {...register("aqisEntry")} />
      </FormRow>

      {aqisField && (
        <>
          <FormRow
            label="Bio"
            error={errors?.bio?.message}
            disabled={isWorking}
          >
            <Input type="checkbox" id="bio" {...register("bio")} />
          </FormRow>
          {bioField && (
            <>
              <FormRow
                label="Bio Date"
                error={errors?.bio?.message}
                disabled={isWorking}
              >
                <Input type="date" id="bioDate" {...register("bioDate")} />
              </FormRow>
              <FormRow
                label="Bio Requested"
                error={errors?.bioRequested?.message}
                disabled={isWorking}
              >
                <Input
                  type="checkbox"
                  id="bioRequested"
                  {...register("bioRequested")}
                />
              </FormRow>
            </>
          )}

          <FormRow label="IFIP">
            <Input type="checkbox" id="ifip" {...register("ifip")} />
          </FormRow>
          {ifipField && (
            <>
              <FormRow
                label="IFIP Date"
                error={errors?.ifip?.message}
                disabled={isWorking}
              >
                <Input type="date" id="ifipDate" {...register("ifipDate")} />
              </FormRow>
              <FormRow
                label="IFIP Requested"
                error={errors?.ifipRequested?.message}
                disabled={isWorking}
              >
                <Input
                  type="checkbox"
                  id="ifipRequested"
                  {...register("ifipRequested")}
                />
              </FormRow>
            </>
          )}
        </>
      )}

      <FormRow
        label="Vessel"
        error={errors?.vessel?.message}
        disabled={isWorking}
      >
        <Input type="text" id="vessel" {...register("vessel")} />
      </FormRow>
      <FormRow
        label="Wharf"
        error={errors?.wharf?.message}
        disabled={isWorking}
      >
        <Input type="text" id="wharf" />
      </FormRow>
      <FormRow
        label="Site Location"
        error={errors?.siteLocation?.message}
        disabled={isWorking}
      >
        <Input type="text" id="siteLocation" {...register("siteLocation")} />
      </FormRow>
      <FormRow
        label="Quantity"
        error={errors?.quantity?.message}
        disabled={isWorking}
      >
        <Input type="number" id="quantity" {...register("quantity")} />
      </FormRow>
      <FormRow
        label="Product"
        error={errors?.product?.message}
        disabled={isWorking}
      >
        <Input type="text" id="product" {...register("product")} />
      </FormRow>
      <FormRow label="File" error={errors?.file?.message} disabled={isWorking}>
        <FileInput
          type="file"
          id="file"
          {...register("file", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label="Notes"
        error={errors?.notes?.message}
        disabled={isWorking}
      >
        <Input type="text" id="notes" {...register("notes")} />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isWorking}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit container" : "Add container"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateContainerForm;
