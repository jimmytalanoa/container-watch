/**
 * Component for converting PDF files using Adobe API and displaying the converted file. Will send converted data to CartonCloud API.
 *
 * @component
 * @example
 * return (
 *   <ConvertPDFForm />
 * )
 */
import { FormProvider, useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { Input } from "../../ui/Input";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import {
  useAddAccessToken,
  useCreateJob,
  useFetchStatus,
  useGetAsset,
  useGetURIUploadRequest,
  useUploadAsset,
} from "./useAdobe";
import OrderPreview from "./OrderPreview";
import toast from "react-hot-toast";
import SpinnerMini from "../../ui/SpinnerMini";

function ConvertPDFForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  const { mutateAsync: addAccessTokenMutation, isLoading: isAccessing } =
    useAddAccessToken();
  const { mutateAsync: addURIUploadRequestMutation, isLoading: isRequesting } =
    useGetURIUploadRequest();
  const { mutateAsync: addAssetMutation, isLoading: isUploading } =
    useUploadAsset();
  const { mutateAsync: addJobMutation, isLoading: isCreating } = useCreateJob();
  const { mutateAsync: addStatusMutation, isLoading: isFetching } =
    useFetchStatus();
  const { mutateAsync: addGetAssetMutation, isLoading: isGetting } =
    useGetAsset();

  // variable for loading state
  const isLoading =
    isAccessing ||
    isRequesting ||
    isUploading ||
    isCreating ||
    isFetching ||
    isGetting;

  // console.log(isLoading);

  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading]);

  const { handleSubmit, register, reset } = useForm({});

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const file = selectedFile;
      if (!file) throw new Error("No file selected");

      // All the mutations for dealing with the Adobe API
      const { access_token } = await addAccessTokenMutation();
      const { assetID, uploadUri } = await addURIUploadRequestMutation(
        access_token
      );
      const assetPayload = [uploadUri, file];
      const uploadResponse = await addAssetMutation(assetPayload);
      console.log(uploadResponse);
      const jobPayload = [access_token, assetID];
      const location = await addJobMutation(jobPayload);
      const statusPayload = [access_token, location];
      const status = await addStatusMutation(statusPayload);
      const data = await addGetAssetMutation(status.data.content.downloadUri);
      setConvertedFile(data);
    } catch (error) {
      onError(error);
    }
  };

  function onError(errors) {
    toast.error(`${errors}`);
    console.log(errors);
  }

  function onReset(e) {
    e.preventDefault();
    setSelectedFile(null);
    setConvertedFile({});
    reset();
    toast("Form reset", { icon: "🔄" });
  }

  return (
    <>
      <FormProvider>
        <Form onSubmit={handleSubmit(onSubmit, onError)} type="regular" key={1}>
          <FormRow label="File">
            <Input
              name="file"
              type="file"
              id="file"
              {...register("file")}
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
            />
          </FormRow>
          <FormRow>
            <Button
              variation="secondary"
              type="reset"
              onClick={(e) => onReset?.(e)}
            >
              Cancel
            </Button>
            <Button onClick={(e) => onSubmit?.(e)}>Upload</Button>
          </FormRow>
        </Form>
        {isLoading && <SpinnerMini />}
        <OrderPreview file={convertedFile} isLoading={loadingState} />
      </FormProvider>
    </>
  );
}

export default ConvertPDFForm;
