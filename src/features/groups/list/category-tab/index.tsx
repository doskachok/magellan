
import { CategoryTabWrapper, CategoryText, CategoryUnderline } from './index.styled';
import { useTranslation } from 'react-i18next';
import { memo, useCallback } from 'react';

export interface ICategoryTabProps {
  tabId: string,
  name: string;
  activeTab: string;
  onClick: (tabName: string) => void;
}

const CategoryTab = (props: ICategoryTabProps) => {
  const { t } = useTranslation('groups');

  const onTabClick = useCallback(() => {
    props.onClick(props.tabId);
  }, []);

  const isTabActive = (tabName: string) => {
    return props.activeTab === tabName;
  };

  return (
    <CategoryTabWrapper onClick={onTabClick}>
      <CategoryText active={isTabActive(props.tabId)}>{props.name}</CategoryText>
      <CategoryUnderline active={isTabActive(props.tabId)} />
    </CategoryTabWrapper>
  );
};

export default memo(CategoryTab);
