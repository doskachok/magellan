import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLazyGetTransactionGroupsQuery } from '../api';
import Header from 'components/Header';
import { ContentWrapper, PageWrapper, Row } from 'components/Containers';
import { ITransactionGroupListItem } from '../types';
import { ReactComponent as PlusIconSVG } from 'assets/images/plus-icon.svg';
import { TextRegular } from 'components';
import { useSelector } from 'react-redux';
import { groupsListSelector } from '../slice';
import Loader from 'components/Loader';
import { FilterTabItemsWrapper, FilterTabsWrapper, GroupsListWrapper } from './index.styled';
import FilterTab from './FilterTab';
import GroupRow from './GroupRow';
import BottomNavigation from 'components/BottomNavigation';

import { ROUTES } from 'constants/routes';

interface IFilterTab {
  key: string;
  filter: (items: ITransactionGroupListItem[]) => ITransactionGroupListItem[];
}

const filterTabs: IFilterTab[] = [
  { key: 'all', filter: (items) => items },
  { key: 'iLent', filter: (items) => items.filter(i => i.yourPart > 0) },
  { key: 'iBorrowed', filter: (items) => items.filter(i => i.yourPart < 0) }
];

const GroupsList = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const groups = useSelector(groupsListSelector);
  
  const [loadGroups, { isLoading }] = useLazyGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<IFilterTab>(filterTabs[0]);

  const filteredGroups = useMemo(() => activeTab.filter(groups || []), [
    groups, activeTab
  ]);

  const onTabClick = useCallback((key: string) => {
    setActiveTab(filterTabs.find(c => c.key === key)!);
  }, [setActiveTab]);

  const onAddIconClick = useCallback(() => {
    navigate(ROUTES.GROUPS.CREATE);
  }, [navigate]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups])

  return (
    <PageWrapper>
      <Header 
        text={t('groups')} 
        rightActionComponent={<PlusIconSVG onClick={onAddIconClick} />} 
        isLoading={isLoading} 
      />
      
      <Loader isLoading={isLoading} />

      <ContentWrapper fullWidth>
        <GroupsListWrapper fullWidth>
          <FilterTabsWrapper jc={'space-between'} fullWidth>
            {filterTabs.map(({ key }) => {
              return <FilterTab key={key} tabId={key} activeTab={activeTab.key} name={t(key)} onClick={onTabClick} />
            })}
          </FilterTabsWrapper>

          <FilterTabItemsWrapper gap={'17px'} fullWidth>
            {filteredGroups.map(g => <GroupRow key={g.id} item={g} />)}

            {
              filteredGroups.length || isLoading ?
                null :
                <Row jc={'center'} fullWidth>
                  <TextRegular>
                    {t('noGroups')}
                  </TextRegular>
                </Row>
            }
          </FilterTabItemsWrapper>
        </GroupsListWrapper>
      </ContentWrapper>

      <BottomNavigation/>
    </PageWrapper>
  );
};

export default GroupsList;
