import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { ROUTES } from 'constants/routes';
import { useGetTransactionGroupByIdQuery } from '../api';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const { data: group } = useGetTransactionGroupByIdQuery(groupId || '');

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  return (
    <PageWrapper>
      <Header
        text={group ? group.name : ''}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

    </PageWrapper>
  );
};

export default GroupDetails;
