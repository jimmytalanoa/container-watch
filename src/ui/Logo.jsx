import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 5rem;
  width: auto;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="/efflog.jpg" alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
