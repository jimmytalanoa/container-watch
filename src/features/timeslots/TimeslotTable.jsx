import TimeslotRow from "./TimeslotRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import { useTimeslots } from "./useTimeslots";
import { getBearerToken } from "../../services/apiOneStop";
import { useQuery } from "@tanstack/react-query";

function TimeslotTable() {
  const { timeslots, isLoading, count } = useTimeslots();

  const {
    data,
    error,
    isLoading: isFetchingToken,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: getBearerToken,
  });

  if (isLoading || isFetchingToken) return <Spinner />;

  // Bearer token for One Stop API calls
  const { access_token: token } = data;

  if (!timeslots.length) return <Empty resourceName="timeslots" />;

  return (
    <Menus>
      <Table columns=".9fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div>Container</div>
          <div>AQIS Date</div>
          <div>AQIS Entry</div>
          <div>Vessel Name</div>
          <div>Status</div>
          <div>ETA Availability</div>
          <div>Note</div>
          <div>P/U Timeslot</div>
          <div>Delivery Destination</div>
          <div>Storage Date</div>
          <div>Port/Wharf</div>
          <div>Client</div>
          <div>Direct Delivery</div>
          <div>Product</div>
          <div>Qty</div>
          <div>De-Hire</div>
          <div>De-Hire Location</div>
          <div>De-Hire Mode of Transport</div>
          <div>Return Park Name</div>
          <div>Return Park Code</div>
          <div>Vessel IMO</div>
          <div>Gross Weight</div>
          <div>Line Operator</div>
          <div>Reefer Temp</div>
          <div>Height</div>
          <div>Bill of Lading</div>
          <div>Origin Port</div>
        </Table.Header>

        <Table.Body
          data={timeslots}
          render={(timeslot) => (
            <TimeslotRow
              key={timeslot.id}
              timeslot={timeslot}
              token={token}
              direction="import"
              country="AU"
            />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default TimeslotTable;
