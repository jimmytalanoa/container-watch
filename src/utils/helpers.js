import { format, formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/esm";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export function trimPortName(port) {
  switch (port) {
    case "VICTORIA INTERNATIONAL CONTAINER TERMINAL":
      return "VICT";
    case "PATRICK, VI, EAST SWANSON":
      return "PAT";
    default:
      return "";
  }
}

export function trimSize(size = "") {
  if (!size.length) return size;
  if (size.startsWith("2")) return "20'";
  if (size.startsWith("4")) return "40'";
  return size;
}

export function trimPort(port = "") {
  switch (port.charAt(0)) {
    case "P":
      return "PAT";
    case "D":
      return "DP";
    case "V":
      return "VICT";
    default:
      return "";
  }
}

export function manualOrAPIOverwrite(manual, api) {
  // console.log(manual, api);
  if (manual && !api) return { value: manual, type: "manual" };
  if (api) return { value: api, type: "updated" };
  if (!manual && !api) return { value: "N/A", type: "manual" };
  return {};
}

export function determineAvailability(
  manual,
  estimatedArrival,
  actualArrival,
  importAvailability
) {
  if (importAvailability)
    return {
      value: importAvailability,
      type: "importAvailability",
      label: "Import Availability",
    };
  if (actualArrival)
    return {
      value: actualArrival,
      type: "actualArrival",
      label: "Actual Arrival",
    };
  if (estimatedArrival)
    return {
      value: estimatedArrival,
      type: "estimatedArrival",
      label: "Estimated Arrival",
    };
  if (manual) return { value: manual, type: "manual", label: "Manual ETA" };
  return "";
}

// 2023-11-06T01:10:00+11:00

export function formatAPIDate(date) {
  if (!date.length) return;
  // console.log(date)
  return format(parseISO(date), "yyyy-MM-dd kk:mm:ss");
  // const formattedDate = format(date.value + "Z", "yyyy-MM-dd kk:mm:ss xxx");
}
