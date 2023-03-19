import styled, { css } from 'styled-components';
import { Row } from '../Containers';

const radius = '10px';

interface IModalBodyProps {
  rounded?: boolean;
}

export const ModalHeader = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: ${props => props.theme.colors.modal.background.default};
  width: 100%;
  border-top-left-radius: ${radius};
  border-top-right-radius: ${radius};
`;

export const ModalBody = styled.div<IModalBodyProps>`
  display: flex;
  padding: 0.5rem;
  background: ${props => props.theme.colors.modal.background.default};
  width: 100%;
  ${props => props.rounded && css`
    border-radius: ${radius};
`};
`;

export const ModalFooter = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  width: 100%;
  background: ${props => props.theme.colors.modal.background.default};
  border-bottom-left-radius: ${radius};
  border-bottom-right-radius: ${radius};
`;