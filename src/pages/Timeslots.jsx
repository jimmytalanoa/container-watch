import Heading from "../ui/Heading";
import Row from "../ui/Row";
import TimeslotTableOperations from "../features/timeslots/TimeslotTableOperations";
import TimeslotTable from "../features/timeslots/TimeslotTable";
import { getBearerToken } from "../services/apiOneStop";

function Timeslots() {
  return (
    <>
      <Row>
        <Heading as="h1">All timeslots</Heading>
        <TimeslotTableOperations />
      </Row>
      <TimeslotTable />
    </>
  );
}

export default Timeslots;
