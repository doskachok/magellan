import styled from 'styled-components';
import { Column } from 'components/Containers';
import { TextRegular } from 'components/Text';

export const PaymentListTitleText = styled(TextRegular)`
  color: ${props => props.theme.colors.text.primary};
  margin: 20px 0;
  width: 100%;
  text-align: center;
`;

export const PaymentListContainer = styled(Column)`
  padding: 0 28px;
  width: 100%;
`;