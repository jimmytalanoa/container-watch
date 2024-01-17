import { useQuery } from "@tanstack/react-query";
import { getVessels } from "../../services/apiVessels";

// API to fetch containers from oneStop
export function useVessels() {
  const {
    isLoading,
    data: vessels,
    error,
  } = useQuery({
    queryKey: ["vessels"],
    queryFn: getVessels,
  });

  return { isLoading, error, vessels };
}
