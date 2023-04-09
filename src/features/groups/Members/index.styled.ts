import styled from 'styled-components';
import { Column, Row } from 'components/Containers';

export const ContentWrapper = styled(Column)`
  padding: 1rem;
  flex: 1;
`;

export const Header = styled(Row)`
  padding-left: 10px;
  padding-bottom: 10px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
`;
