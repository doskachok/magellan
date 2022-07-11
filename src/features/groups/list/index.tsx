import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';

import { useGetTransactionGroupsQuery } from '../api';
import Header from '../../../components/Header';
import { Column, PageWrapper } from '../../../components/Containers';
import { FilterTabsWrapper, ContentWrapper } from './index.styled';
import GroupRow from './group-row';
import { ITransactionGroupListItem } from '../types';
import FilterTab from './filter-tab';

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

  const { data: groups } = useGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<IFilterTab>(filterTabs[0]);

  const filteredGroups = useMemo(() => activeTab.filter(groups || []), [
    groups, activeTab
  ]);

  const onTabClick = useCallback((key: string) => {
    setActiveTab(filterTabs.find(c => c.key === key)!);
  }, []);

  return (
    <PageWrapper>
      <Header text={t('groups')} />

      <ContentWrapper fullWidth>
        <FilterTabsWrapper jc={'space-between'} fullWidth>
          {filterTabs.map(({ key }) => {
            return <FilterTab key={key} tabId={key} activeTab={activeTab.key} name={t(key)} onClick={onTabClick} />
          })}
        </FilterTabsWrapper>

        <Column gap={'17px'} fullWidth>
          {filteredGroups.map(g => <GroupRow key={g.id} item={g} />)}
        </Column>


      </ContentWrapper>
    </PageWrapper>
  );
};

export default GroupsList;
