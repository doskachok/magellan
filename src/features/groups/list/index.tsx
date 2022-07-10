import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { useGetTransactionGroupsQuery } from '../api';
import Header from '../../../components/Header';
import { Column, PageWrapper } from '../../../components/Containers';
import { CategoriesWrapper, ContentWrapper } from './index.styled';
import CategoryTab from './category-tab';
import GroupRow from './group-row';

const categoryTabs = ['all', 'iLent', 'iBorrowed'];

const GroupsList = () => {
  const { t } = useTranslation('groups');

  const { data: groups } = useGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<string>(categoryTabs[0]);

  const onTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName);
  }, []);

  return (
    <PageWrapper>
      <Header text={t('groups')} />

      <ContentWrapper fullWidth>
        <CategoriesWrapper jc={'space-between'} fullWidth>
          {categoryTabs.map(name => {
            return <CategoryTab key={name} tabId={name} activeTab={activeTab} name={t(name)} onClick={onTabClick} />
          })}
        </CategoriesWrapper>

        <Column gap={'17px'} fullWidth>
          {groups?.map(g => <GroupRow key={g.id} item={g}/>)}
        </Column>


      </ContentWrapper>
    </PageWrapper>
  );
};

export default GroupsList;
