import { PAGE_SIZE } from "../utils/constants";
import supabase, { supabaseUrl } from "./supabase";

export async function getContainers({ filter, sortBy, page }) {
  // const { data, error } = await supabase.from("containers").select("*");
  let query = supabase
    .from("containers")
    .select(
      "id, cargoType, containerNumber, size, aqisEntry, vessel, etaAvailability, discharge, timeslot, wharf, siteLocation, client, product, quantity, aqis, user, image, file",
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
    console.error(error);
    throw new Error("Containers could not be loaded");
  }

  return { data, count };
}

export async function createEditContainer(newContainer, id) {
  const hasFilePath = newContainer.file?.startsWith?.(supabaseUrl);
  const fileName = `${Math.random()}-${newContainer.file.name}`.replaceAll(
    "/",
    ""
  );
  const filePath = hasFilePath
    ? newContainer.file
    : `${supabaseUrl}/storage/v1/object/sign/eidos/${fileName}`;

  // 1. Create container
  let query = supabase.from("containers");

  // CREATE CONTAINER
  if (!id) query = query.insert([{ ...newContainer, file: filePath }]);

  // EDIT CONTAINER
  if (id)
    query = query.update({ ...newContainer, file: filePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Container could not be created");
  }

  // 2. Upload EIDO
  if (hasFilePath) return data;
  const { error: storageError } = await supabase.storage
    .from("eidos")
    .upload(fileName, newContainer.file);

  // 3. Delete container if there was an error uploading
  if (storageError) {
    await supabase.from("containers").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Container  File could not be uploaded. Container creation failed."
    );
  }

  return data;
}

export async function deleteContainer(id) {
  const { error } = await supabase.from("containers").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Container could not be deleted");
  }
}
