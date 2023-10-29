import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { HalfCircle } from 'components';
import { ContentWrapper, PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';


const ExpenseDetails = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <PageWrapper>
      <Header
        text={'Todo'}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <HalfCircle />

      </ContentWrapper>
    </PageWrapper>
  );
};

export default ExpenseDetails;
