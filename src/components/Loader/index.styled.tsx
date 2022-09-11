import styled from 'styled-components';


export const LoaderStyled = styled.div`
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  place-content: center;

  svg {
    width: 110px;
    height: 110px;
    display: inline-block;
  }

  .cls-1, .cls-2 {
    fill: none;
    stroke-linecap: bevel;
    stroke-linejoin: round;
  }

  .cls-1 {
    stroke-width: 3px;
  }

  .cls-2 {
    fill: none;
    stroke: ${props => props.theme.colors.button.primary};
    stroke-width: 6px;
  }
`;
