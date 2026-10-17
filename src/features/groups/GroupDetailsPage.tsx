import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ChartPie, CheckCircle2, HandCoins, History, Plus, Receipt, Settings } from 'lucide-react';
import styled from 'styled-components';

import {
  Avatar,
  Balance,
  ButtonLink,
  Card,
  CardList,
  EmptyState,
  IconLink,
  ListRow,
  MoneyText,
  Muted,
  PageSpinner,
  PlainList,
  Screen,
  Section,
  TopBar,
} from 'components';
import { getFileUrl } from 'lib/config';
import { dayKey, formatDay, formatMoney, toneOf } from 'lib/format';
import { routes } from 'lib/routes';
import { useCurrentUserId } from 'features/users/api';
import { useGetGroupDebtsQuery, useGetGroupQuery } from './api';
import type { Debt, GroupTransaction } from './types';

const HeaderCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
`;

const HeaderText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
  min-width: 0;
`;

const BalanceLine = styled.p<{ $tone: 'positive' | 'negative' | 'neutral' }>`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme, $tone }) => ($tone === 'neutral' ? theme.colors.textMuted : theme.colors[$tone])};
`;

const ExpenseIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brandSoft};
  color: ${({ theme }) => theme.colors.brand};
`;

const SettlementIcon = styled(ExpenseIcon)`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.positive};
`;

const DayHeading = styled.h3`
  padding: ${({ theme }) => theme.space(2, 4)};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SettledRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(4)};
  color: ${({ theme }) => theme.colors.positive};
`;

const involves = (debt: Debt, userId: string) => debt.lenderId === userId || debt.debtorId === userId;

const groupByDay = (transactions: GroupTransaction[]) => {
  const days = new Map<string, GroupTransaction[]>();
  const sorted = transactions.toSorted((a, b) => b.paymentDateUtc.localeCompare(a.paymentDateUtc));
  for (const transaction of sorted) {
    const key = dayKey(transaction.paymentDateUtc);
    days.set(key, [...(days.get(key) ?? []), transaction]);
  }
  return [...days];
};

const GroupDetailsPage = () => {
  const { t } = useTranslation('groups');
  const { groupId = '' } = useParams();
  const userId = useCurrentUserId();

  const { data: group, isLoading } = useGetGroupQuery(groupId);
  const { data: debts = [] } = useGetGroupDebtsQuery(groupId);

  const myBalance = useMemo(
    () =>
      debts.reduce((sum, debt) => {
        if (debt.lenderId === userId) return sum + debt.amount;
        if (debt.debtorId === userId) return sum - debt.amount;
        return sum;
      }, 0),
    [debts, userId],
  );

  // Debts involving the current user first — those are the ones they can act on.
  const sortedDebts = useMemo(
    () => debts.toSorted((a, b) => Number(involves(b, userId)) - Number(involves(a, userId))),
    [debts, userId],
  );

  const days = useMemo(() => groupByDay(group?.transactions ?? []), [group]);

  const renderDebt = (debt: Debt) => {
    const amount = formatMoney(debt.amount, debt.currencyCode);
    const key = `${debt.debtorId}-${debt.lenderId}`;

    if (!involves(debt, userId)) {
      return (
        <ListRow
          key={key}
          leading={<Avatar name={debt.debtorName} src={getFileUrl(debt.debtorAvatarId)} size={36} />}
          title={t('debtOwes', { debtor: debt.debtorName, lender: debt.lenderName, amount })}
        />
      );
    }

    // The other person names the row and the amount gets its own line, so neither is cut off by the button.
    const iAmLender = debt.lenderId === userId;
    return (
      <ListRow
        key={key}
        leading={
          iAmLender ? (
            <Avatar name={debt.debtorName} src={getFileUrl(debt.debtorAvatarId)} size={36} />
          ) : (
            <Avatar name={debt.lenderName} src={getFileUrl(debt.lenderAvatarId)} size={36} />
          )
        }
        title={iAmLender ? debt.debtorName : debt.lenderName}
        subtitle={<MoneyText>{t(iAmLender ? 'debtOwesYouAmount' : 'debtYouOweAmount', { amount })}</MoneyText>}
        trailing={
          <ButtonLink size="sm" variant="secondary" to={routes.settleDebt(groupId, debt)}>
            {t('settleUp')}
          </ButtonLink>
        }
      />
    );
  };

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;
    if (!group) return <EmptyState icon={<Receipt size={28} />} title={t('groupNotFound')} />;

    const balanceTone = toneOf(myBalance);

    return (
      <>
        <HeaderCard $padded>
          <Avatar name={group.name} src={getFileUrl(group.avatarId)} size={56} />
          <HeaderText>
            <Muted>{t('memberCount', { count: group.participants.length })}</Muted>
            <BalanceLine $tone={balanceTone}>
              {balanceTone === 'positive' && t('balanceOwed', { amount: formatMoney(myBalance, group.currencyCode) })}
              {balanceTone === 'negative' && t('balanceOwe', { amount: formatMoney(-myBalance, group.currencyCode) })}
              {balanceTone === 'neutral' && t('balanceSettled')}
            </BalanceLine>
          </HeaderText>
        </HeaderCard>

        {group.transactions.length > 0 && (
          <Section title={t('balances')}>
            <Card>
              {sortedDebts.length === 0 ? (
                <SettledRow>
                  <CheckCircle2 size={22} aria-hidden />
                  {t('everyoneSettled')}
                </SettledRow>
              ) : (
                sortedDebts.map(renderDebt)
              )}
            </Card>
          </Section>
        )}

        <Section title={t('expenses')}>
          {days.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Receipt size={28} />}
                title={t('noExpensesTitle')}
                description={t('noExpensesDescription')}
              />
            </Card>
          ) : (
            <CardList>
              {days.map(([day, transactions]) => (
                <li key={day}>
                  <DayHeading>{formatDay(day)}</DayHeading>
                  <PlainList>
                    {transactions.map(transaction => (
                      <li key={transaction.id}>
                        <ListRow
                          to={routes.expense(group.id, transaction.id)}
                          leading={
                            transaction.isSettlement ? (
                              <SettlementIcon aria-hidden>
                                <HandCoins size={20} />
                              </SettlementIcon>
                            ) : (
                              <ExpenseIcon aria-hidden>
                                <Receipt size={20} />
                              </ExpenseIcon>
                            )
                          }
                          title={transaction.isSettlement ? t('settlement') : transaction.name}
                          subtitle={<MoneyText>{formatMoney(transaction.totalAmount, transaction.currencyCode)}</MoneyText>}
                          trailing={
                            <Balance
                              variant={transaction.isSettlement ? 'settlement' : 'expense'}
                              amount={transaction.yourPart} currencyCode={transaction.currencyCode} />
                          }
                        />
                      </li>
                    ))}
                  </PlainList>
                </li>
              ))}
            </CardList>
          )}
        </Section>
      </>
    );
  };

  return (
    <Screen
      topBar={
        <TopBar
          title={group?.name ?? ''}
          back={routes.groups}
          actions={
            <>
              <IconLink tone="onBrand" to={routes.groupActivity(groupId)} label={t('activity')} icon={<History size={22} />} />
              <IconLink tone="onBrand" to={routes.groupStatistics(groupId)} label={t('statsTitle')} icon={<ChartPie size={22} />} />
              <IconLink tone="onBrand" to={routes.groupSettings(groupId)} label={t('groupSettings')} icon={<Settings size={22} />} />
            </>
          }
        />
      }
      footer={
        group && (
          <ButtonLink to={routes.newExpense(groupId)} fullWidth icon={<Plus size={20} />}>
            {t('addExpense')}
          </ButtonLink>
        )
      }
    >
      {renderBody()}
    </Screen>
  );
};

export default GroupDetailsPage;
