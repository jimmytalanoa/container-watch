import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getTimeslots({ filter, sortBy, page }) {
  let query = supabase
    .from("timeslots")
    .select(
      "id, created, container, type, size, weight, comm, full, yard_location, vessel, pin, exp_cutoff, est_discharge,storage_start, pool, timeslot_date, time_zone, status ",
      { count: "exact" }
    );

  // FILTER
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error);
    throw new Error("Timeslots could not be loaded");
  }

  return { data, count };
}
