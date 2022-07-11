
import { FilterTabWrapper, FilterTabText, FilterTabUnderline } from './index.styled';
import { useTranslation } from 'react-i18next';
import { memo, useCallback } from 'react';

export interface IFilterTabProps {
  tabId: string,
  name: string;
  activeTab: string;
  onClick: (tabName: string) => void;
}

const FilterTab = (props: IFilterTabProps) => {
  const { t } = useTranslation('groups');

  const onTabClick = useCallback(() => {
    props.onClick(props.tabId);
  }, []);

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
