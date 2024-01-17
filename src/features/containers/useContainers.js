import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContainers } from "../../services/apiContainers";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

// API to fetch containers from supabase
export function useContainers() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("size");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "aqis";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    isLoading,
    data: { data: containers, count } = {},
    error,
  } = useQuery({
    queryKey: ["containers", filter, sortBy, page],
    queryFn: () => getContainers({ filter, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["containers", filter, sortBy, page + 1],
      queryFn: () => getContainers({ filter, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["containers", filter, sortBy, page - 1],
      queryFn: () => getContainers({ filter, page: page - 1 }),
    });

  // const {
  //   isLoading,
  //   data: containers,
  //   error,
  // } = useQuery({
  //   queryKey: ["containers"],
  //   queryFn: getContainers,
  // });

  // API CALL for onestop data on the container

  return { isLoading, error, containers, count };
}
