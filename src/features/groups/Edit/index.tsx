import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';

import { ROUTES } from 'constants/routes';

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';

import { ContentWrapper } from './index.styled';
import Loader from '../../../components/Loader';

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [getGroup, {data: group, isLoading}] = useLazyGetTransactionGroupByIdQuery();
  
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
        isLoading={isLoading}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <GroupForm group={group} />
      </ContentWrapper>

      <Loader isLoading={isLoading}/>
    </PageWrapper>
  );
};

export default Edit;
