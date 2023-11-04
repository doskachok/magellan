import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageWrapper, Row } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';
import Members from '../Members';

import { ROUTES } from 'constants/routes';

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';

import { GroupEditContentWrapper } from './index.styled';
import Loader from 'components/Loader';
import { ButtonBase, TextUnderline } from 'components';

enum GroupEditMode {
  GeneralInfo,
  Members,
}

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [getGroup, { data: group, isLoading }] = useLazyGetTransactionGroupByIdQuery();

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

      <GroupEditContentWrapper>
        {mode === GroupEditMode.GeneralInfo && <GroupForm group={group} />}

        {mode === GroupEditMode.Members && <Members groupId={group?.id || ''} />}

        <Row jc='center' ai='center' mt='1rem' fullWidth>
          <ButtonBase onClick={onChangeModeHandler}>
            <TextUnderline>
              {t(mode === GroupEditMode.GeneralInfo ? 'addGroupMembers' : 'editGeneralInfo')}
            </TextUnderline>

            <ArrowRightSVG />
          </ButtonBase>
        </Row>
      </GroupEditContentWrapper>

      <Loader isLoading={isLoading} />
    </PageWrapper>
  );
};

export default Edit;
