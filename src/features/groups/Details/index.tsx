import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { ResolveGroupRoute, ROUTES } from 'constants/routes';
import { useGetTransactionGroupByIdQuery } from '../api';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as EditIconSVG } from 'assets/images/edit-icon.svg';
import BottomNavigation from 'components/BottomNavigation';
import { ContentWrapper } from './index.styled';

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const { data: group } = useGetTransactionGroupByIdQuery(groupId || '');

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  const handleEditAction = useCallback(() => {
    navigate(ResolveGroupRoute(`${ROUTES.GROUPS.EDIT}/${groupId}`));
  }, [navigate, groupId]);


  return (
    <PageWrapper>
      <Header
        text={group ? group.name : ''}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
        rightActionComponent={<EditIconSVG onClick={handleEditAction} />}
      />

      <ContentWrapper fullWidth>
      </ContentWrapper>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default GroupDetails;
