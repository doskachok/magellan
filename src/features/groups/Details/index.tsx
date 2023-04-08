import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PageWrapper } from 'components/Containers';
import Header from 'components/Header';
import { composeGroupRoute, GroupRouteMode, ROUTES } from 'constants/routes';
import { useLazyGetTransactionGroupByIdQuery } from '../api';
import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { ReactComponent as EditIconSVG } from 'assets/images/edit-icon.svg';
import BottomNavigation from 'components/BottomNavigation';
import TransactionRow from './TransactionRow';
import { ContentWrapper, DateText, HalfEllipse, NoTransactionsText, TransactionListContainer } from './index.styled';
import { createDateString, datesAreOnSameDay } from 'helpers/dateUtil';

import { selectedGroupSelector } from '../slice';
import Loader from 'components/Loader';


const GroupDetails = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [getGroup, { isLoading }] = useLazyGetTransactionGroupByIdQuery();
  const group = useSelector(selectedGroupSelector);

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);

  const handleEditAction = useCallback(() => {
    navigate(composeGroupRoute(groupId || '', GroupRouteMode.EDIT));
  }, [navigate, groupId]);

  useEffect(() => {
    getGroup(groupId || '');
  }, [getGroup, groupId])

  return (
    <PageWrapper>
      <Header
        text={group ? group.name : ''}
        isLoading={isLoading}
        leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
        rightActionComponent={<EditIconSVG onClick={handleEditAction} />}
        avatarId={group?.avatarId}
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

          {
            group?.transactions.length || isLoading ? null :
              <NoTransactionsText>
                {t('noTransactions')}
              </NoTransactionsText>
          }
        </TransactionListContainer>
      </ContentWrapper>

      <Loader isLoading={isLoading}/>

      <BottomNavigation />
    </PageWrapper>
  );
};

export default GroupDetails;
