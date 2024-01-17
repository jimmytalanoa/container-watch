import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getTimeslots } from "../../services/apiTimeslots";
import { PAGE_SIZE } from "../../utils/constants";

export function useTimeslots() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  const {
    isLoading,
    data: { data: timeslots, count } = {},
    error,
  } = useQuery({
    queryKey: ["timeslots", filter, sortBy, page],
    queryFn: () => getTimeslots({ filter, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["timeslots", filter, sortBy, page + 1],
      queryFn: () => getTimeslots({ filter, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["timeslots", filter, sortBy, page - 1],
      queryFn: () => getTimeslots({ filter, page: page - 1 }),
    });

  return { isLoading, error, timeslots, count };
}
