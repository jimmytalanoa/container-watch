import Spinner from "../../ui/Spinner";
import ContainerRow from "./ContainerRow";
import { useContainers } from "./useContainers";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBearerToken } from "../../services/apiOneStop";

function ContainerTable() {
  const { isLoading, containers, count } = useContainers();
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    isLoading: isFetchingToken,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: getBearerToken,
  });

  if (isLoading || isFetchingToken) return <Spinner />;

  // FILTER
  const filterValue = searchParams.get("status") || "all";

  let filteredContainers;
  if (filterValue === "all") filteredContainers = containers;
  if (filterValue === "available")
    filteredContainers = containers.filter(
      (container) => container.status === "available"
    );
  if (filterValue === "unavailable")
    filteredContainers = containers.filter(
      (container) => container.status === "unavailable"
    );

  // SORT
  const sortBy = searchParams.get("sortBy") || "aqis-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedContainers = filteredContainers.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  if (!containers.length) return <Empty resourceName="containers" />;

  return (
    <Menus>
      <Table columns="1fr 1fr .6fr .6fr 1fr .6fr .6fr .6fr .6fr .6fr .6fr .6fr .6fr .6fr .6fr">
        <Table.Header>
          <div>Container</div>
          <div>Status</div>
          <div>AQIS</div>
          <div>Vessel</div>
          <div>Availability</div>
          <div>P/U Timeslot</div>
          <div>Delivery Destination</div>
          <div>Storage Date</div>
          <div>Wharf</div>
          <div>Product</div>
          <div>De-Hire</div>
          <div>Holds</div>
          <div>gross (kg)</div>
        </Table.Header>

        <Table.Body
          // data={containers}
          data={sortedContainers}
          render={(container) => (
            <ContainerRow
              key={container.id}
              container={container}
              token={data.access_token}
              direction="import"
              country="AU"
            />
          )}
        />
      </Table>
      <Table.Footer>
        <Pagination count={count} />
      </Table.Footer>
    </Menus>
  );
}

export default ContainerTable;
