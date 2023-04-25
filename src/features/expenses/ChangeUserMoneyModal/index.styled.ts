import styled from 'styled-components';
import { ModalBody } from 'components/Modal';
import { Row } from 'components/Containers';
import { ButtonBase } from 'components';

export const MembersModalBody = styled(ModalBody)`
  background: ${props => props.theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 32px 32px;
`;

export const AmountInputWrapper = styled(Row)`
  margin-top: -22px;
`;

export const ButtonDone = styled(ButtonBase)`
  height: 36px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50px;
  border: 2px solid ${props => props.theme.colors.secondary};
  padding: 0px 32px;
  
  &:active {
    transition: 0.1s;
    transform: scale(1.02, 1.05);
  };
`;