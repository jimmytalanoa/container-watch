/**
 * Renders the OrderPreview component.
 *
 * @param {object} file - The file object.
 * @param {boolean} isLoading - Indicates whether the mutations in ConvertPDFForm are mutating.
 * @returns {JSX.Element} The rendered OrderPreview component.
 */
import { useEffect, useState } from "react";
import extractRathCoSaleOrder from "./Extracter";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { Input } from "../../ui/Input";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { addOutboundOrder } from "../../services/apiCartonCloud";
import toast from "react-hot-toast";

function OrderPreview(file, isLoading) {
  const [convertedFile, setConvertedFile] = useState({});
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset,
  } = useForm({ defaultValues: {} });

  // console.log(isLoading);

  // console.log("PRE SAMPLE", sampleData);
  // console.log("PRE SAMPLE 1", sampleData1);
  // console.log("PRE SAMPLE 2", sampleData2);
  // console.log("PRE SAMPLE 3", sampleData3);
  // const sampleText = extractText(sampleData);
  // const sampleText1 = extractText(sampleData1);
  // const sampleText2 = extractText(sampleData2);
  // const sampleText3 = extractText(sampleData3);
  // console.log("SAMPLE TEXT", sampleText);
  // console.log("SAMPLE TEXT 1", sampleText1);
  // console.log("SAMPLE TEXT 2", sampleText2);
  // console.log("SAMPLE TEXT 3", sampleText3);

  // const {
  //   deliveryAddress,
  //   orderDetails,
  //   specialInstructions,
  //   orderItemsArray,
  // } = sampleText1;
  // console.log(orderDetails?.CustomerRef);

  useEffect(() => setConvertedFile(file), [file]);

  const onSubmit = async (data, e) => {
    // e.preventDefault();
    // console.log(e);
    if (!data || !e) return;
    e.preventDefault();
    // console.log(data, e);
    // using data, group together each Batch, Code, and Quantity into a new array
    // then map over the array and create a new object with the keys Batch, Code, and Quantity
    // then push each object into a new array
    // then set the new array to a variable
    // then call the addOutboundOrder function and pass in the new array
    const keys = Object.keys(data);
    const values = Object.values(data);
    const orderItemsArray = [];
    const orderItemsObj = {};
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].includes("Batch")) {
        orderItemsObj.Batch = values[i];
      }
      if (keys[i].includes("Code")) {
        orderItemsObj.Code = values[i];
      }
      if (keys[i].includes("Quantity")) {
        orderItemsObj.Quantity = values[i];
        orderItemsArray.push({ ...orderItemsObj });
      }
    }

    // console.log("ORDER ITEMS ARRAY", orderItemsArray);

    addOutboundOrder(data, orderItemsArray);
    // console.log(result);
  };

  function onError(errors) {
    console.log(errors);
  }

  function onReset(e) {
    e.preventDefault();
    setConvertedFile({});
    reset();
    toast("Form reset", { icon: "🔄" });
  }

  if (Object.keys(convertedFile).includes("file")) {
    // console.log(" CONVERTED FILE", convertedFile);
    if (Object.keys(convertedFile.file).includes("elements")) {
      // console.log("LENGTH", Object.keys(convertedFile).length);

      // const data = extractRathcoOrder(convertedFile.file);
      const test = extractRathCoSaleOrder(convertedFile.file);
      // console.log("TEST", test);

      // console.log("DATA", data);
      const {
        deliveryAddress,
        orderDetails,
        specialInstructions,
        orderItemsArray,
      } = test;

      // console.log(deliveryAddress);

      return (
        <Form
          onSubmit={handleSubmit2(onSubmit, onError)}
          type="regular"
          key={2}
        >
          <h1>Order Preview</h1>

          <FormRow label="Delivery Name">
            <Input
              type="text"
              defaultValue={deliveryAddress?.[0].Text || ""}
              id="deliveryName"
              {...register2("deliveryName")}
            ></Input>
          </FormRow>
          <FormRow label="Delivery Street">
            <Input
              defaultValue={deliveryAddress?.[1]?.Text || ""}
              type="text"
              id="deliveryStreet"
              {...register2("deliveryStreet")}
            ></Input>
          </FormRow>
          <FormRow label="Delivery Suburb">
            <Input
              type="text"
              defaultValue={deliveryAddress?.[2]?.Text || ""}
              id="deliverySuburb"
              {...register2("deliverySuburb")}
            ></Input>
          </FormRow>
          <FormRow label="Delivery State">
            <Input
              type="text"
              defaultValue={deliveryAddress?.[3]?.Text || ""}
              id="deliveryState"
              {...register2("deliveryState")}
            ></Input>
          </FormRow>
          <FormRow label="Delivery Post Code">
            <Input
              type="text"
              defaultValue={deliveryAddress?.[4]?.Text || ""}
              id="deliveryPostCode"
              {...register2("deliveryPostCode")}
            ></Input>
          </FormRow>

          <FormRow label="Customer Reference">
            <Input
              type="text"
              defaultValue={
                orderDetails?.CustomerRef || orderDetails?.PickingSlipNo
              }
              id="customerReference"
              {...register2("customerReference")}
            ></Input>
          </FormRow>
          <FormRow label="Picking Slip No.">
            <Input
              type="text"
              defaultValue={orderDetails?.PickingSlipNo || ""}
              id="pickingSlipNo"
              {...register2("pickingSlipNo")}
            ></Input>
          </FormRow>
          <FormRow label="Delivery Required Date">
            <Input
              type="text"
              defaultValue={orderDetails?.["DeliveryReqd.Date"] || ""}
              id="deliveryDate"
              {...register2("deliveryDate")}
            ></Input>
          </FormRow>
          <FormRow label="Carrier">
            <Input
              type="text"
              defaultValue={orderDetails?.Carrier || ""}
              id="carrier"
              {...register2("carrier")}
            ></Input>
          </FormRow>
          <FormRow label="Special Instructions">
            <Input
              type="text"
              defaultValue={specialInstructions || ""}
              id="specialInsrtuctions"
              {...register2("specialInstructions")}
            ></Input>
          </FormRow>

          <h3>Order Items</h3>
          {orderItemsArray?.map((item, index) =>
            Object.keys(item).map((key, i) => (
              <FormRow key={i} label={`${key} ${index + 1}`}>
                <Input
                  type="text"
                  defaultValue={item[key] || ""}
                  id={`${key}${index + 1}`}
                  {...register2(`${key}${index + 1}`)}
                ></Input>
              </FormRow>
            ))
          )}
          <FormRow>
            <Button onClick={(e) => onReset(e)}>Reset</Button>
            <Button onClick={(e, data) => onSubmit?.(e, data)} type="submit">
              Send to CC
            </Button>
          </FormRow>
        </Form>
      );
    }
  }

  return <div>{!isLoading && <div>No file uploaded.</div>}</div>;
}

export default OrderPreview;
