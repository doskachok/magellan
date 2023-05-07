import styled from 'styled-components';
import { Column } from 'components/Containers';
import { TextRegular } from 'components';

export const TransactionListContainer = styled(Column)`
  padding: 0 28px;
  width: 100%;
`;

export const DateText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  margin: 20px 0;
  width: 100%;
  text-align: center;
`;

export const NoTransactionsText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;