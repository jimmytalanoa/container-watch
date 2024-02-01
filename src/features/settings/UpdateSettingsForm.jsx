import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { Input } from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const {
    isLoading,
    settings: { storagePeriodDP, storagePeriodVICT, storagePeriodPat } = {},
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  function handleUpdate(e, field) {
    const { value } = e.target;

    if (!value) return;
    updateSetting({ [field]: value });
  }

  return (
    <Form>
      <FormRow label="DP Storage-free days">
        <Input
          type="number"
          id="storagePeriodDP"
          defaultValue={storagePeriodDP}
          onBlur={(e) => handleUpdate(e, "storagePeriodDP")}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="VICT Storage-free days">
        <Input
          type="number"
          id="storagePeriodVICT"
          defaultValue={storagePeriodVICT}
          onBlur={(e) => handleUpdate(e, "storagePeriodVICT")}
          disabled={isUpdating}
        />
      </FormRow>

      <FormRow label="Pat Storage-free days">
        <Input
          type="number"
          id="storagePeriodPat"
          defaultValue={storagePeriodPat}
          onBlur={(e) => handleUpdate(e, "storagePeriodPat")}
          disabled={isUpdating}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
