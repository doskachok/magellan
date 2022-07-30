import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLazyGetTransactionGroupsQuery } from '../api';
import Header from '../../../components/Header';
import { PageWrapper, Row } from '../../../components/Containers';
import { FilterTabsWrapper, ContentWrapper, GroupDetailsWrapper, GroupsListWrapper, FilterTabItemsWrapper } from './index.styled';
import GroupRow from './group-row';
import { ITransactionGroup, ITransactionGroupListItem } from '../types';
import FilterTab from './filter-tab';
import { ReactComponent as PlusIconSVG } from '../../../assets/images/plus-icon.svg';
import { ReactComponent as BackIconSVG } from '../../../assets/images/back-icon.svg';
import GroupDetails from './group-details';
import { TextRegular } from '../../../components/Text';
import { useDispatch, useSelector } from 'react-redux';
import { groupsListSelector, saveGroup } from '../slice';

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

  const [loadGroups] = useLazyGetTransactionGroupsQuery();

  const [activeTab, setActiveTab] = useState<IFilterTab>(filterTabs[0]);

  const [isGroupDetailsMode, setIsGroupDetailsMode] = useState<boolean>(false);
  const [isAddGroupMembersMode, setIsAddGroupMembersMode] = useState<boolean>(false);
  const [editedGroupId, setEditedGroupId] = useState<string | null>(null);

  const filteredGroups = useMemo(() => activeTab.filter(groups || []), [
    groups, activeTab
  ]);

  const onTabClick = useCallback((key: string) => {
    setActiveTab(filterTabs.find(c => c.key === key)!);
  }, [setActiveTab]);

  const onAddIconClick = useCallback(() => {
    setIsGroupDetailsMode(true);
  }, [setIsGroupDetailsMode]);

  const onBackIconClick = useCallback(() => {
    if (isAddGroupMembersMode) {
      setIsAddGroupMembersMode(false);
    } else if (isGroupDetailsMode) {
      setIsGroupDetailsMode(false);
      setEditedGroupId(null);
    }
  }, [isAddGroupMembersMode, isGroupDetailsMode]);

  const onGroupSaved = useCallback((group: ITransactionGroup) => {
    setIsGroupDetailsMode(false);
    setEditedGroupId(null);

    dispatch(saveGroup(group));
  }, [dispatch]);

  const onAddMembersModeChange = useCallback((value: boolean) => {
    setIsAddGroupMembersMode(value);
  }, []);

  const onGroupClick = useCallback((group: ITransactionGroupListItem) => {
    setEditedGroupId(group.id);
    setIsGroupDetailsMode(true);
  }, []);

  const headerText = useMemo(() => isAddGroupMembersMode ?
    t('groupMembers') :
    isGroupDetailsMode ?
      editedGroupId ? t('updateGroup') : t('createGroup') :
      t('groups'), [isAddGroupMembersMode, isGroupDetailsMode, editedGroupId, t]);

  const leftAction = useMemo(() => (isGroupDetailsMode || isAddGroupMembersMode) ?
    <BackIconSVG onClick={onBackIconClick} /> :
    null,
    [isGroupDetailsMode, isAddGroupMembersMode, onBackIconClick]);

  const rightAction = useMemo(() => (!isGroupDetailsMode && !isAddGroupMembersMode) ?
    <PlusIconSVG onClick={onAddIconClick} /> :
    null,
    [isGroupDetailsMode, isAddGroupMembersMode, onAddIconClick]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups])

  return (
    <PageWrapper>
      <Header text={headerText} leftActionComponent={leftAction} rightActionComponent={rightAction} />

      <ContentWrapper fullWidth>
        {
          !isGroupDetailsMode &&
          <GroupsListWrapper fullWidth>
            <FilterTabsWrapper jc={'space-between'} fullWidth>
              {filterTabs.map(({ key }) => {
                return <FilterTab key={key} tabId={key} activeTab={activeTab.key} name={t(key)} onClick={onTabClick} />
              })}
            </FilterTabsWrapper>

            <FilterTabItemsWrapper gap={'17px'} fullWidth>
              {filteredGroups.map(g => <GroupRow key={g.id} item={g} onClick={onGroupClick} />)}

              {
                filteredGroups.length ?
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
          isGroupDetailsMode &&
          <GroupDetailsWrapper fullWidth>
            <GroupDetails
              groupId={editedGroupId}
              onSaved={onGroupSaved}
              isAddGroupMembersMode={isAddGroupMembersMode}
              onGroupMembersModeChange={onAddMembersModeChange}
            />
          </GroupDetailsWrapper>
        }
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GroupsList;
