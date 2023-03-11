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
  margin-top: 3px;
  color: ${props => props.theme.colors.text.primary};
  text-align: left;
  font-size: 0.8em;
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

export const YourPartAmount = styled(TextRegular)<YouPartProps>`
  place-self: end;
  color: ${props => props.theme.colors.button.disabled};

  ${props => props.amount && css`
     color: ${props.amount > 0 ? props.theme.colors.text.notification.success : props.theme.colors.text.error }
  `};
`;

export const YourPartAmountHint = styled(YourPartAmount)`
  font-size: 0.7em;
  margin-bottom: 3px;
`;
