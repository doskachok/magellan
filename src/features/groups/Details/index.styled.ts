import styled from 'styled-components';
import { Column, Row } from 'components/Containers';
import { TextRegular } from 'components';

export const ContentWrapper = styled(Column)`
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

export const HalfEllipse = styled(Row)`
  border-radius: 100%;
  background: ${props => props.theme.colors.primary};
  width: 120vw;
  height: 80vw;
  z-index: 0;
  margin-top: -55vw;
  margin-left: -10vw;
`;

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