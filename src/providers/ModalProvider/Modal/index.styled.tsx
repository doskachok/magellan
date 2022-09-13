import styled, { css, keyframes } from 'styled-components';

interface IModalBackgroundProps {
  show: boolean;
}

const fadeInOpacity = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const ModalBackground = styled.div<IModalBackgroundProps>`
  width: 100%;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  top: 0;
  transition: all .3s ease-in-out;
  ${props => props.show && css`
    opacity: 1;
  `};
  animation: ${fadeInOpacity} 0.3s ease-in;
`;

export const ModalContainer = styled.div`
  width: 100%;
  padding: 5rem 1rem 1rem 1rem;
`;

interface IModalContentProps {
  show: boolean;
}

const fadeIn = keyframes`
  from {
    margin-top: -100%;
    opacity: 0;
  }

  to {
    margin-top: 0%;
    opacity: 1;
  }
`;

export const ModalContent = styled.div<IModalContentProps>`
  width: 100%;
  -webkit-box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74);
  -moz-box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74);
  box-shadow: -1px -2px 42px -19px rgba(0,0,0,0.74);
  margin-top: -100%;
  transition: all .5s ease-in-out;
  ${props => props.show && css`
    visibility: visible;
    opacity: 1;
    margin-top: 0%;
  `};
  animation: ${fadeIn} 0.3s ease-in;
`;
