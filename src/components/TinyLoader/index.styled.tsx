import styled from 'styled-components';

export const TinyLoaderStyled = styled.div`
  .loader-line {
    margin-top: -5px;
    width: 100vw;
    height: 5px;
    position: relative;
    overflow: hidden;
    background-color: #ddd;
  }

  .loader-line:before {
    content: '';
    position: absolute;
    left: -50%;
    height: 5px;
    width: 40%;
    z-index: 1;
    background-color: ${(props) => props.theme.colors.button.primary};
    -webkit-animation: lineAnim 1s linear infinite;
    -moz-animation: lineAnim 1s linear infinite;
    animation: lineAnim 1s linear infinite;
  }

  @keyframes lineAnim {
    0% {
      left: -40%;
    }
    50% {
      left: 20%;
      width: 80%;
    }
    100% {
      left: 100%;
      width: 100%;
    }
  }
`;
