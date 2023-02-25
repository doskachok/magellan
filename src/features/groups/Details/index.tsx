import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { ResolveGroupRoute, ROUTES } from 'constants/routes';
import { useGetTransactionGroupByIdQuery } from '../api';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as EditIconSVG } from 'assets/images/edit-icon.svg';
import BottomNavigation from 'components/BottomNavigation';
import TransactionRow from './TransactionRow';
import { ContentWrapper, DateText, HalfEllipse, TransactionListContainer } from './index.styled';
import { datesAreOnSameDay } from 'helpers/dateUtil';


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

  const createDateString = (date: Date) => {
    if (date.getFullYear() === new Date().getFullYear()) {
      return date.toLocaleDateString("en-GB", {day: 'numeric', month: 'long' });
    }
    else {
      return date.toLocaleDateString("en-GB", {day: 'numeric', month: 'long', year: 'numeric' });
    }
  };

  return (
    <PageWrapper>
      <Header
        text={group ? group.name : ''}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
        rightActionComponent={<EditIconSVG onClick={handleEditAction} />}
      />

      <ContentWrapper fullWidth>
        <HalfEllipse fullWidth />
        <TransactionListContainer>
          {group?.transactions.map((tr, index, array) => {
            if (index === 0 || !datesAreOnSameDay(tr.paymentDateUtc, array[index - 1].paymentDateUtc)) {
              return (
                <React.Fragment key={tr.id}>
                  <DateText> {createDateString(tr.paymentDateUtc)} </DateText>
                  <TransactionRow transaction={tr} />
                </React.Fragment>
              );
            }
            return (
              <TransactionRow key={tr.id} transaction={tr} />
            );
          })}
        </TransactionListContainer>
      </ContentWrapper>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default GroupDetails;
