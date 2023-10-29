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
import PaymentRow from './PaymentRow';
import { selectedGroupSelector } from 'features/groups/slice';
import { PaymentListContainer, PaymentListTitleText } from './index.styled';


const ExpenseDetails = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();

  const [getExpense, { isLoading }] = useLazyGetTransactionByIdQuery();
  const expense = useSelector(selectTransactionById(expenseId || ''));
  const group = useSelector(selectedGroupSelector);

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

        <PaymentListTitleText> {"Payers:"} </PaymentListTitleText>
        <PaymentListContainer>
          {expense?.payerDetails.map((pd) => {
            const user = group?.participants.find((p) => p.id === pd.payerId);
            return (
              <PaymentRow key={pd.payerId}
                // TODO: query user by id when user is not in the group instead of showing payerId
                user={user?.name || user?.email || pd.payerId} 
                amount={pd.amount}
                currencyCode={expense.currencyCode} />
            );
          })}
        </PaymentListContainer>

        <PaymentListTitleText> {"Participants:"} </PaymentListTitleText>
        <PaymentListContainer>
          {expense?.partialsAssignments.map((pa) => {
            const user = group?.participants.find((p) => p.id === pa.userId);
            return (
              <PaymentRow key={pa.userId}
                // TODO: query user by id when user is not in the group instead of showing userId
                user={user?.name || user?.email || pa.userId} 
                amount={pa.partialAmount}
                currencyCode={expense.currencyCode} />
            );
          })}
        </PaymentListContainer>
      </ContentWrapper>
      <Loader isLoading={isLoading}/>
    </PageWrapper>
  );
};

export default ExpenseDetails;
