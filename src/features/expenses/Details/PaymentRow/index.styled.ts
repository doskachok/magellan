import styled from 'styled-components';
import { Row } from 'components/Containers';
import { TextRegular } from 'components';

export const PaymentRowContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  gap: 5px;
`;

export const PaymentAmountText = styled(TextRegular)`
  margin-top: 3px;
  color: ${props => props.theme.colors.text.primary};
  text-align: left;
  font-size: 0.8em;
  overflow-wrap: break-word;
`;

export const UserNameText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
  font-weight: 700;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;