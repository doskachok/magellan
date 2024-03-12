import styled from 'styled-components';
import { Column, Row } from 'components/Containers';

export const ContentWrapperMembers = styled(Column)`
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  flex: 1;
  scroll-snap-align: center;
  background-color: white;
  z-index: 1;
`;

export const Header = styled(Row)`
  padding-left: 10px;
  padding-bottom: 10px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
`;
