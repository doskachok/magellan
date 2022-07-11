
import { memo, useCallback } from 'react';

import { FilterTabWrapper, FilterTabText, FilterTabUnderline } from './index.styled';

export interface IFilterTabProps {
  tabId: string,
  name: string;
  activeTab: string;
  onClick: (tabName: string) => void;
}

const FilterTab = (props: IFilterTabProps) => {
  const onTabClick = useCallback(() => {
    props.onClick(props.tabId);
  }, [props]);

  const isTabActive = (tabName: string) => {
    return props.activeTab === tabName;
  };

  return (
    <FilterTabWrapper onClick={onTabClick}>
      <FilterTabText active={isTabActive(props.tabId)}>{props.name}</FilterTabText>
      <FilterTabUnderline active={isTabActive(props.tabId)} />
    </FilterTabWrapper>
  );
};

export default memo(FilterTab);
