import styled from "styled-components";

const StyledSpan = styled.span`
  text-transform: uppercase;
  color: var(--color-grey-500);
`;

function ContainerDetailRow({
  vesselIMO,
  height,
  reeferTemp = "",
  lineOperator,
  originPort,
  billOfLading,
  notes,
}) {
  return (
    <>
      <StyledSpan>Line Operator: {lineOperator}</StyledSpan>
      <StyledSpan>Height: {height}</StyledSpan>
      <StyledSpan>Reefer Temp: {reeferTemp}</StyledSpan>
      <StyledSpan>IMO: {vesselIMO}</StyledSpan>
      <StyledSpan>Origin Port: {originPort?.commonName}</StyledSpan>
      <StyledSpan>BOL: {billOfLading}</StyledSpan>
      <StyledSpan>NOTES: {notes}</StyledSpan>
    </>
  );
}

export default ContainerDetailRow;
