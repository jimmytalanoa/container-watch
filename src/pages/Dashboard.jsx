import DashboardFilter from "../features/dashboard/DashboardFilter";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import Example from "../ui/Charts";
import Container from "../ui/Container";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>
      <Row>
        <div>These 3 containers have actions today:</div>
        <Container />

        <div>80% of containers in the last 30 days had Biosecurity</div>
        <Row>
          <Example />
          <DashboardLayout />
        </Row>
      </Row>
    </>
  );
}

export default Dashboard;
