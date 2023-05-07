import styled from 'styled-components';
import { Column, Row } from 'components/Containers';

export const GroupsListWrapper = styled(Column)`
  padding: 40px 20px 0px; // top, horizontal, bottom
  flex: 1;
  gap: 30px;
  z-index: 0;
`;

export const FilterTabsWrapper = styled(Row)`
  padding: 0 1rem;
`;

export const FilterTabItemsWrapper = styled(Column)`
  overflow: auto;
  flex: 0px 1;
  padding-bottom: 2rem;
`;

export const GroupEditWrapper = styled(Column)`
  position: absolute;
  height: 100%;
`;
