import Button from "../ui/Button";
import Heading from "../ui/Heading";
import { Input } from "../ui/Input";
import Row from "../ui/Row";
import { vesselData } from "../features/vessels/vesselData";
import styled from "styled-components";

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

function Vessels() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Vessel Details</Heading>
      </Row>
      <Row>
        <div>
          <Input />
          <Button>Search Vessel</Button>
        </div>
      </Row>
      <Table role="table">
        <TableHeader role="row">
          <div>Vessel</div>
          <div>Status</div>
          <div>Availability</div>
        </TableHeader>
        {vesselData.map((vessel) => (
          <TableRow key={vessel.vessel}>
            <div>{vessel.vessel}</div>
            <div>{vessel.status}</div>
            <div>{vessel.unloadEta}</div>
          </TableRow>
        ))}
      </Table>
      <Row>
        <div></div>
      </Row>
    </>
  );
}

export default Vessels;
