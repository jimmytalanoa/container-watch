import styled from "styled-components";

const StyledContainer = styled.span`
  border: 1px solid var(--color-grey-200);
  padding: 1.6rem 2.4rem;
  border-radius: 20px 0px 0px 20px;
`;

const StyledAction = styled.span`
  border: 1px solid var(--color-grey-200);
  padding: 1.6rem 2.4rem;
  border-radius: 0px 20px 20px 0px;
`;

function Container() {
  return (
    <>
      <div>
        <StyledContainer>TEMU2944026</StyledContainer>
        <StyledAction>BIOSECURITY</StyledAction>
      </div>
      <div></div>
      <div>
        <StyledContainer>MSKU7941415</StyledContainer>
        <StyledAction>PICKUP: 16:00, DP World</StyledAction>
      </div>
      <div></div>
      <div>
        <StyledContainer>TEMU2944026</StyledContainer>
        <StyledAction>DEHIRE: 18:00, MEDLOG</StyledAction>
      </div>
    </>
  );
}

export default Container;
