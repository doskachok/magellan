import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { HalfCircle } from 'components';
import { ContentWrapper, PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import Loader from 'components/Loader';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { useLazyGetTransactionByIdQuery } from '../api';
import { selectTransactionById } from '../slice';


const ExpenseDetails = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();

  const [getExpense, { isLoading }] = useLazyGetTransactionByIdQuery();
  const expense = useSelector(selectTransactionById(expenseId || ''));

  const handleBackAction = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    getExpense(expenseId || '');
  }, [getExpense, expenseId])

  return (
    <PageWrapper>
      <Header
        text={expense ? expense.name : ''}
        isLoading={isLoading}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
      />

      <ContentWrapper fullWidth>
        <HalfCircle />

      </ContentWrapper>
      <Loader isLoading={isLoading}/>
    </PageWrapper>
  );
};

export default ExpenseDetails;
