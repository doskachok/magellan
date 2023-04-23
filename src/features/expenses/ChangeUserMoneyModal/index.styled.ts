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