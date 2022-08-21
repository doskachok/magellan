import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLazyGetTransactionGroupsQuery } from '../api';
import Header from '../../../components/Header';
import { PageWrapper, Row } from '../../../components/Containers';
import { ITransactionGroup, ITransactionGroupListItem } from '../types';
import { ReactComponent as PlusIconSVG } from '../../../assets/images/plus-icon.svg';
import { ReactComponent as BackIconSVG } from '../../../assets/images/back-icon.svg';
import GroupEdit from '../edit';
import { TextRegular } from '../../../components/Text';
import { useDispatch, useSelector } from 'react-redux';
import { groupsListSelector, saveGroup } from '../slice';
import Loader from '../../../components/Loader';
import { ContentWrapper, FilterTabItemsWrapper, FilterTabsWrapper, GroupEditWrapper, GroupsListWrapper } from './index.styled';
import FilterTab from './filter-tab';
import GroupRow from './group-row';

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
  const groups = useSelector(groupsListSelector);
  const dispatch = useDispatch();

  const [loadGroups, { isLoading }] = useLazyGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<IFilterTab>(filterTabs[0]);

  const [isGroupEditMode, setIsGroupEditMode] = useState<boolean>(false);
  const [isAddGroupMembersMode, setIsAddGroupMembersMode] = useState<boolean>(false);
  const [editedGroup, setEditedGroup] = useState<ITransactionGroupListItem | null>(null);

  const filteredGroups = useMemo(() => activeTab.filter(groups || []), [
    groups, activeTab
  ]);

  const onTabClick = useCallback((key: string) => {
    setActiveTab(filterTabs.find(c => c.key === key)!);
  }, [setActiveTab]);

  const onAddIconClick = useCallback(() => {
    setIsGroupEditMode(true);
  }, [setIsGroupEditMode]);

  const onBackIconClick = useCallback(() => {
    if (isAddGroupMembersMode) {
      setIsAddGroupMembersMode(false);
    } else if (isGroupEditMode) {
      setIsGroupEditMode(false);
      setEditedGroup(null);
    }
  }, [isAddGroupMembersMode, isGroupEditMode]);

  const onGroupSaved = useCallback((group: ITransactionGroup) => {
    setIsGroupEditMode(false);
    setEditedGroup(null);

    dispatch(saveGroup(group));
  }, [dispatch]);

  const onAddMembersModeChange = useCallback((value: boolean) => {
    setIsAddGroupMembersMode(value);
  }, []);

  const onGroupClick = useCallback((group: ITransactionGroupListItem) => {
    setEditedGroup(group);
    setIsGroupEditMode(true);
  }, []);

  const headerText = useMemo(() => isAddGroupMembersMode ?
    t('groupMembers') :
    isGroupEditMode ?
      editedGroup ? t('updateGroup') : t('createGroup') :
      t('groups'), [isAddGroupMembersMode, isGroupEditMode, editedGroup, t]);

  const leftAction = useMemo(() => (isGroupEditMode || isAddGroupMembersMode) ?
    <BackIconSVG onClick={onBackIconClick} /> :
    null,
    [isGroupEditMode, isAddGroupMembersMode, onBackIconClick]);

  const rightAction = useMemo(() => (!isGroupEditMode && !isAddGroupMembersMode) ?
    <PlusIconSVG onClick={onAddIconClick} /> :
    null,
    [isGroupEditMode, isAddGroupMembersMode, onAddIconClick]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups])

  return (
    <PageWrapper>
      <Header text={headerText} leftActionComponent={leftAction} rightActionComponent={rightAction} isLoading={isLoading} />
      <Loader isLoading={isLoading} />
      
      <ContentWrapper fullWidth>
        {
          !isGroupEditMode &&
          <GroupsListWrapper fullWidth>
            <FilterTabsWrapper jc={'space-between'} fullWidth>
              {filterTabs.map(({ key }) => {
                return <FilterTab key={key} tabId={key} activeTab={activeTab.key} name={t(key)} onClick={onTabClick} />
              })}
            </FilterTabsWrapper>

            <FilterTabItemsWrapper gap={'17px'} fullWidth>
              {filteredGroups.map(g => <GroupRow key={g.id} item={g} onClick={onGroupClick} />)}

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
        }

        {
          isGroupEditMode &&
          <GroupEditWrapper fullWidth>
            <GroupEdit
              groupListItem={editedGroup}
              onSaved={onGroupSaved}
              isAddGroupMembersMode={isAddGroupMembersMode}
              onGroupMembersModeChange={onAddMembersModeChange}
            />
          </GroupEditWrapper>
        }
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GroupsList;
