import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';
import Members from '../Members';

import { ROUTES } from 'constants/routes';

import BackIconSVG from 'assets/images/back-icon.svg?react';

import { GroupPage } from '../enums';
import SliderContainer from 'components/SliderContainer';

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();  
  const [getGroup, { isLoading, data: group }] = useLazyGetTransactionGroupByIdQuery();
  const sliderItems = [GroupPage.EditMain, GroupPage.Members, GroupPage.Statistics];

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
  }, [groupId, getGroup]);

  return (
    <PageWrapper>
      <Header
        isLoading={isLoading}
        text={t(groupId ? 'updateGroup' : 'createGroup')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      {
      groupId ?
        <SliderContainer 
          className='w-100'
          sliderItems={sliderItems}
          translationGroup='groups'
        >
          <GroupForm key={GroupPage.EditMain} group={group} />
          <Members key={GroupPage.Members} groupId={groupId} />
          <div key={GroupPage.Statistics}>Not implemented</div>
        </SliderContainer>
      :
        <GroupForm group={group} />
      }
    </PageWrapper>
  );
};

export default Edit;
