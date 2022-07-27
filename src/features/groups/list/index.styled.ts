import styled from 'styled-components';
import { Column, PageContentWrapper, Row } from '../../../components/Containers';

export const ContentWrapper = styled(Column)`
  position: relative;
  overflow:hidden;
  height: calc(100vh - 80px);
`;

export const GroupsListWrapper = styled(PageContentWrapper)`
  padding-top: 40px;
  flex: 1;
  gap: 30px;
  z-index: 0;
`;

export const FilterTabsWrapper = styled(Row)`
  padding: 0 1rem;
`;

export const FilterTabItemsWrapper = styled(Column)`
  overflow: auto;
  height: calc(100vh - 11.2rem);
  padding-bottom: 2rem;
`;

export const GroupDetailsWrapper = styled(Column)`
  position: absolute;
`;
