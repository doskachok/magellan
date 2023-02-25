import styled from 'styled-components';
import {  Row } from 'components/Containers';
import { TextHeader, TextRegular } from 'components';

export const TransactionRowContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  gap: 5px;
`;

export const TransactionAmountText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  width: 4.5rem;
  text-align: left;
  overflow-wrap: break-word;
`;

export const TransactionNameText = styled(TextHeader)`
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const YourPartText = styled(TextRegular)`
  color: ${props => props.theme.colors.primary};
  width: 4rem;
  text-align: end;
`;