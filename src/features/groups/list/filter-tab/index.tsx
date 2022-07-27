
import { memo, useCallback } from 'react';

import { FilterTabWrapper, FilterTabText, FilterTabUnderline } from './index.styled';

export interface IFilterTabProps {
  tabId: string,
  name: string;
  activeTab: string;
  onClick: (tabName: string) => void;
}

const FilterTab = ({ tabId, name, activeTab, onClick }: IFilterTabProps) => {
  const onTabClick = useCallback(() => {
    onClick(tabId);
  }, [tabId, onClick]);

  const isTabActive = (tabName: string) => {
    return activeTab === tabName;
  };

  return (
    <FilterTabWrapper onClick={onTabClick}>
      <FilterTabText active={isTabActive(tabId)}>{name}</FilterTabText>
      <FilterTabUnderline active={isTabActive(tabId)} />
    </FilterTabWrapper>
  );
};

export default memo(FilterTab);
