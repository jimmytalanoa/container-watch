import { adobeCredentials } from "../utils/constants";
import axios from "axios";
import QueryString from "qs";

export async function getAccessToken() {
  // Gets adobe Access Token for future calls
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //   const urlencoded = new URLSearchParams();
  //   urlencoded.append("client_id", adobeCredentials.client_credentials.client_id);
  //   urlencoded.append(
  //     "client_secret",
  //     adobeCredentials.client_credentials.client_secret
  //   );

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: urlencoded,
  //     redirect: "follow",
  //   };

  //   const res = await axios.fetch(
  //     "https://pdf-services.adobe.io/token",
  //     requestOptions
  //   );
  //   const result = await res.json();

  let data = QueryString.stringify({
    client_id: adobeCredentials.client_credentials.client_id,
    client_secret: adobeCredentials.client_credentials.client_secret,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://pdf-services-ue1.adobe.io/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const res = await axios.request(config);
  const result = await res.data;
  return result;
}

export async function getURIUploadRequest(accessToken) {
  //   const myHeaders = new Headers();
  //   myHeaders.append("X-API-Key", adobeCredentials.client_credentials.client_id);
  //   myHeaders.append("Authorization", `Bearer ${accessToken}`);
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     mediaType: "application/pdf",
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   const res = await fetch(
  //     "https://pdf-services.adobe.io/assets",
  //     requestOptions
  //   );
  //   const result = await res.json();

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://pdf-services-ue1.adobe.io/assets",
    headers: {
      "X-API-Key": adobeCredentials.client_credentials.client_id,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      mediaType: "application/pdf",
    }),
  };

  const res = await axios.request(config);
  const result = await res.data;

  return result;
}

export async function uploadAsset(payload) {
  console.log(payload);
  const [uploadURI, file] = payload;
  console.log(uploadURI, file);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/pdf");

  const formdata = new FormData();
  formdata.append("", file);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const res = await fetch(uploadURI, requestOptions);
  console.log(res?.statusText);
  //   const formdata = new FormData();
  //   formdata.append("", file);

  //   console.log(uploadURI, file);

  //   let config = {
  //     method: "put",
  //     maxBodyLength: Infinity,
  //     url: uploadURI,
  //     headers: {
  //       "Content-Type": "application/pdf",
  //     },
  //     data: formdata,
  //   };

  //   const response = await axios.request(uploadURI, config);
  //   const result = await response.data;

  return res;
}

export async function createJob(payload) {
  //   const myHeaders = new Headers();
  //   myHeaders.append("x-api-key", adobeCredentials.client_credentials.client_id);
  //   myHeaders.append("Authorization", `Bearer ${accessToken}`);
  //   myHeaders.append("Content-Type", "application/json");

  //   console.log("CJ ASSET", assetID);

  //   const raw = JSON.stringify({
  //     assetID: assetID,
  //     getCharBounds: true,
  //     includeStyling: true,
  //     elementsToExtract: ["text", "tables"],
  //     tableOutputFormat: "csv",
  //     renditionsToExtract: ["tables", "figures"],
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   const res = await fetch(
  //     "https://pdf-services-ue1.adobe.io/operation/extractpdf",
  //     requestOptions
  //   );

  //   const result = await res.headers.get("location");
  //   console.log(result);

  const [accessToken, assetID] = payload;
  let data = JSON.stringify({
    assetID: assetID,
    getCharBounds: false,
    includeStyling: false,
    elementsToExtract: ["text", "tables"],
    tableOutputFormat: "csv",
    renditionsToExtract: ["tables", "figures"],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://pdf-services-ue1.adobe.io/operation/extractpdf",
    headers: {
      "x-api-key": adobeCredentials.client_credentials.client_id,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  console.log(accessToken, assetID);

  const response = await axios.request(config);
  const result = await response.headers.get("location");

  return result;
}

export async function fetchStatus(payload) {
  const [accessToken, location] = payload;

  console.log(accessToken, location);
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: location,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": adobeCredentials.client_credentials.client_id,
    },
    data: "",
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let response;
  while (true) {
    response = await axios.request(config);

    if (response.data.status === "done") {
      break;
    }

    await delay(3000);
  }

  //   console.log("RESPONSE", response);
  return response;
}

export async function getAsset(downloadUri) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const res = await fetch(downloadUri, requestOptions);
  const result = await res.json();
  console.log("RESULT", result);

  return result;
}

export async function fetchJSON(assetID, downloadUri) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const res = await fetch(downloadUri, requestOptions);
  const result = await res.json();
  console.log("JSON", result);

  return result;
}
