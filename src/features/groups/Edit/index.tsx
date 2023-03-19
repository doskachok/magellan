import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';
import Members from '../Members';

import { ROUTES } from 'constants/routes';

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';

import { AddMembersWrapper, ContentWrapper } from './index.styled';
import Loader from 'components/Loader';
import {TextUnderline} from 'components';

enum GroupEditMode {
  GeneralInfo,
  Members,
}

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [getGroup, {data: group, isLoading}] = useLazyGetTransactionGroupByIdQuery();
  
  const [mode, setMode] = useState<GroupEditMode>(GroupEditMode.GeneralInfo);
  
  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);
  
  const onChangeModeHandler = () => {
    setMode(mode => mode === GroupEditMode.GeneralInfo ? GroupEditMode.Members : GroupEditMode.GeneralInfo);
  }
  
  useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
  }, [groupId, getGroup]);

  return (
    <PageWrapper>
      <Header
        text={t(groupId ? 'updateGroup' : 'createGroup')}
        isLoading={isLoading}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        {mode === GroupEditMode.GeneralInfo && <GroupForm group={group} />}

        {mode === GroupEditMode.Members && <Members groupId={group?.id || ''} />}

        <AddMembersWrapper onClick={onChangeModeHandler}>
          <TextUnderline>
            {t(mode === GroupEditMode.GeneralInfo ? 'addGroupMembers' : 'editGeneralInfo')}
          </TextUnderline>

          <ArrowRightSVG />
        </AddMembersWrapper>
      </ContentWrapper>

      <Loader isLoading={isLoading}/>
    </PageWrapper>
  );
};

export default Edit;
