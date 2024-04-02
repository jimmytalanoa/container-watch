import axios from "axios";
import { effectiveCredentials, rathCoCredentials } from "../utils/constants";

const gatewayHost = "https://api.cartoncloud.com";
const tenantUuid = effectiveCredentials.tenants[0].id;
const customerUuid = rathCoCredentials.client_UUID;
const authClientId = rathCoCredentials.client_credentials.client_id;
const authClientSecret = rathCoCredentials.client_credentials.client_secret;

export async function getAccessToken() {
  const data = `grant_type=client_credentials&client_id=${authClientId}&client_secret=${authClientSecret}`;
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${gatewayHost}/uaa/oauth/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Version": "1",
    },
    data: data,
  };

  const res = await axios.request(config);
  console.log(res.data.access_token);
  return res.data.access_token;
}

export async function addOutboundOrder(order, orderItemsArray) {
  if (!order) return;
  const accessToken = await getAccessToken();
  console.log(order, orderItemsArray, accessToken);

  const {
    deliveryName,
    deliveryStreet,
    deliverySuburb,
    deliveryState,
    deliveryPostCode,
    carrier,
    customerReference,
    deliveryDate,
    specialInstructions,
  } = order;

  const items = orderItemsArray.map((orderItem) => ({
    properties: {
      sop_custom_field_1: orderItem.Batch,
    },
    details: {
      product: {
        references: {
          code: orderItem.Code,
        },
      },
    },
    measures: {
      quantity: parseInt(orderItem.Quantity),
    },
  }));

  // with deliveryDate, replace / with - to match the format
  // expected by the API
  const deliveryDateReplaced = deliveryDate.replace(/\//g, "-");

  console.log(items);

  console.log(
    deliveryName,
    deliveryStreet,
    deliverySuburb,
    deliveryState,
    deliveryPostCode,
    carrier,
    customerReference,
    deliveryDateReplaced,
    specialInstructions
  );

  let data = JSON.stringify({
    type: "OUTBOUND",
    references: {
      customer: customerReference,
    },
    customer: {
      id: customerUuid,
    },
    details: {
      urgent: false,
      instructions: specialInstructions,
      deliver: {
        address: {
          companyName: deliveryName,
          address1: deliveryStreet,
          suburb: deliverySuburb,
          postcode: deliveryPostCode,
          state: {
            code: deliveryState,
          },
          country: {
            iso2Code: "AU",
          },
          requiredDate: deliveryDateReplaced,
        },
      },
    },
    items: items,
  });

  console.log(items);

  console.log([
    {
      details: {
        product: {
          references: {
            code: "testCode",
          },
        },
      },
      measures: {
        quantity: 10,
      },
    },
    {
      details: {
        product: {
          references: {
            code: "testCode2",
          },
        },
      },
      measures: {
        quantity: 101,
      },
    },
  ]);

  console.log(data);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${gatewayHost}/tenants/${tenantUuid}/outbound-orders`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Accept-Version": "1",
    },
    data: data,
  };

  console.log(config);

  async function makeRequest() {
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  makeRequest();
}
