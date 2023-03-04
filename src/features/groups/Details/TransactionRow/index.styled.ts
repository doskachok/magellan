import styled, { css } from 'styled-components';
import { Row } from 'components/Containers';
import { TextRegular } from 'components';

interface YouPartProps {
  amount: number;
}

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

export const TransactionNameText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
  font-weight: 700;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const YourPartText = styled(TextRegular)<YouPartProps>`
  width: 4rem;
  text-align: end;
  color: ${props => props.theme.colors.button.disabled};

  ${props => props.amount && css`
     color: ${props.amount > 0 ? props.theme.colors.text.notification.success : props.theme.colors.text.error }
  `};
`;