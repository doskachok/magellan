import styled, { css } from 'styled-components';

const radius = '10px';

interface IModalBodyProps {
  reversedColor?: boolean;
  rounded?: boolean;
}

export const ModalBody = styled.div<IModalBodyProps>`
  display: flex;
  padding: 0.5rem;
  background: ${props => props.theme.colors.modal.background.default};
  ${props => props.reversedColor && css`
    background: ${props => props.theme.colors.primary};
  `};
  width: 100%;
  ${props => props.rounded && css`
    border-radius: ${radius};
`};
`;