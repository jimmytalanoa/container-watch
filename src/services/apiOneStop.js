import {
  oneStopTokenUrl,
  BASE_64,
  oneStopTrackingEndpoint,
  apiKey,
} from "../utils/constants";

export async function getBearerToken() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${BASE_64}`);
  myHeaders.append("Cookie", "XSRF-TOKEN=bd2c4673-5040-4554-9a80-bcd06fed68a7");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  const res = await fetch(oneStopTokenUrl, requestOptions);
  const result = await res.json();

  return result;
}

export async function getContainerDetails(
  container,
  token,
  country,
  direction
) {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", apiKey);
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // const query = `${oneStopTrackingEndpoint}/v1/transportEquipment/${container}/details?direction=${direction}&country=${country}`;

  // const res = await fetch(query, requestOptions);
  // const data = await res.json();
  // const { cargoAttribute, equipmentAttribute, equipmentJourney } = data;

  // console.log(data);
  // console.log(equipmentAttribute);
  // console.log(equipmentJourney);
  // console.log(cargoAttribute);

  const data = await fetch(
    "https://connect.1-stop.biz/tracking/v1/transportEquipment/TLLU2686977/details?direction=import&country=AU",
    requestOptions
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log("error", error));

  // if (!res.ok) {
  //   console.error(res.status);
  //   throw new Error("Container data could not be loaded");
  // }

  // return { cargoAttribute, equipmentAttribute, equipmentJourney };

  return data;
}
