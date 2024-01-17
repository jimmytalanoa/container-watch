import { apiKey, clientId, clientSecret, oneStopUrl } from "./apiOneStop";

// External api for vessels from onestop
export async function getVessels() {
  try {
    let query = await fetch(oneStopUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${apiKey}`,
      },
      body: {
        grant_type: "client_credentials",
      },
    });
    let data = await query.json();
    return data;
  } catch (err) {
    return err;
  }
}
