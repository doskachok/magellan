import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Column, PageWrapper } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';
import Members from '../Members';

import { ROUTES } from 'constants/routes';

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { DoubleContainer } from './index.styled';

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [getGroup, { data: group }] = useLazyGetTransactionGroupByIdQuery();

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
        text={t(groupId ? 'updateGroup' : 'createGroup')}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <DoubleContainer fullHeight fullWidth>
        <Column fullHeight fullWidth>
          <GroupForm group={group} />
        </Column>
        
        { groupId ? 
        <Column fullWidth fullHeight>
          <Members groupId={groupId} />
        </Column> :
        null }

      </DoubleContainer>
    </PageWrapper>
  );
};

export default Edit;
