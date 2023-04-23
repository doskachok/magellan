import styled from 'styled-components';
import { ModalBody } from 'components/Modal';
import { Row } from 'components/Containers';

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

export const ButtonDone = styled.button`
  height: 33px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50px;
  border: 2px solid ${props => props.theme.colors.secondary};
  
  padding: 6px 33px;
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.theme.colors.text.secondary};
  
  &:active {
    transition: 0.1s;
    transform: scale(1.02, 1.05);
  };
`;