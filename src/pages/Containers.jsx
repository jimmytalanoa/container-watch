import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ContainerTable from "../features/containers/ContainerTable";
import ContainerTableOperations from "../features/containers/ContainerTableOperations";
import AddContainer from "../features/containers/AddContainer";

function Containers() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All containers</Heading>
        <ContainerTableOperations />
      </Row>
      <Row>
        <AddContainer />
        <ContainerTable />
      </Row>
    </>
  );
}

export default Containers;
