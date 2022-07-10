import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';

import { useGetTransactionGroupsQuery } from '../api';
import Header from '../../../components/Header';
import { Column, PageWrapper } from '../../../components/Containers';
import { CategoriesWrapper, ContentWrapper } from './index.styled';
import CategoryTab from './category-tab';
import GroupRow from './group-row';
import { ITransactionGroupListItem } from '../types';

interface ICategoryTab {
  key: string;
  filter: (items: ITransactionGroupListItem[]) => ITransactionGroupListItem[];
}

const categoryTabs: ICategoryTab[] = [
  { key: 'all', filter: (items) => items },
  { key: 'iLent', filter: (items) => items.filter(i => i.yourPart > 0) },
  { key: 'iBorrowed', filter: (items) => items.filter(i => i.yourPart < 0) }
];

const GroupsList = () => {
  const { t } = useTranslation('groups');

  const { data: groups } = useGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<ICategoryTab>(categoryTabs[0]);

  const filteredGroups = useMemo(() => activeTab.filter(groups || []), [
    groups, activeTab
  ]);

  const onTabClick = useCallback((key: string) => {
    setActiveTab(categoryTabs.find(c => c.key === key)!);
  }, []);

  return (
    <PageWrapper>
      <Header text={t('groups')} />

      <ContentWrapper fullWidth>
        <CategoriesWrapper jc={'space-between'} fullWidth>
          {categoryTabs.map(({ key }) => {
            return <CategoryTab key={key} tabId={key} activeTab={activeTab.key} name={t(key)} onClick={onTabClick} />
          })}
        </CategoriesWrapper>

        <Column gap={'17px'} fullWidth>
          {filteredGroups.map(g => <GroupRow key={g.id} item={g} />)}
        </Column>


      </ContentWrapper>
    </PageWrapper>
  );
};

export default GroupsList;
