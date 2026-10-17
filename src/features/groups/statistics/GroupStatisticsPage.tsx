import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ChartPie } from 'lucide-react';
import styled, { useTheme } from 'styled-components';

import {
  Card,
  CardList,
  EmptyState,
  ListRow,
  MoneyText,
  Muted,
  PageSpinner,
  Screen,
  Section,
  SegmentedControl,
  TopBar,
} from 'components';
import { formatMoney, formatShortDate } from 'lib/format';
import { routes } from 'lib/routes';
import { useGetGroupQuery, useGetGroupStatisticsQuery } from '../api';
import type { CurrencyStatistics } from '../types';
import { DonutChart } from './DonutChart';
import { MonthlyChart } from './MonthlyChart';
import { PaidVsShareChart } from './PaidVsShareChart';
import { toSlices } from './slices';

/** Twelve bars still fit a phone; older months drop off the chart. */
const MAX_MONTHS = 12;

const TotalCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`;

const TotalValue = styled.p`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  line-height: ${({ theme }) => theme.font.lineHeight.tight};
  font-variant-numeric: tabular-nums;
`;

const Tiles = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space(3)};
  margin: ${({ theme }) => theme.space(3, 0, 0)};
  padding-top: ${({ theme }) => theme.space(3)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2px;
  }

  dt {
    font-size: ${({ theme }) => theme.font.size.xs};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    margin: 0;
    font-weight: ${({ theme }) => theme.font.weight.semibold};
    font-variant-numeric: tabular-nums;
  }
`;

const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`;

const GroupStatisticsPage = () => {
  const { t } = useTranslation('groups');
  const theme = useTheme();
  const { groupId = '' } = useParams();

  const { data: group } = useGetGroupQuery(groupId);
  const { data: statistics = [], isLoading } = useGetGroupStatisticsQuery(groupId);
  const [selectedCurrency, setSelectedCurrency] = useState<string>();

  // The API lists the group's own currency first.
  const current = statistics.find(s => s.currencyCode === selectedCurrency) ?? statistics[0];

  const renderStatistics = (stats: CurrencyStatistics) => {
    const { currencyCode, members } = stats;
    const money = (amount: number) => formatMoney(amount, currencyCode);
    const memberCount = members.filter(m => m.isParticipant).length || 1;
    const months = stats.monthly.slice(-MAX_MONTHS);
    const largest = stats.topExpenses[0];

    return (
      <>
        <TotalCard $padded>
          <Muted>{t('statsTotalSpent')}</Muted>
          <TotalValue>{money(stats.totalSpent)}</TotalValue>
          <Muted>
            {t('statsExpenseCount', { count: stats.expenseCount })} ·{' '}
            {t('statsPeriod', {
              from: formatShortDate(stats.firstExpenseDateUtc),
              to: formatShortDate(stats.lastExpenseDateUtc),
            })}
          </Muted>
          <Tiles>
            <div>
              <dt>{t('statsAverageExpense')}</dt>
              <dd>{money(stats.averageExpense)}</dd>
            </div>
            <div>
              <dt>{t('statsPerMember')}</dt>
              <dd>{money(stats.totalSpent / memberCount)}</dd>
            </div>
            <div>
              <dt>{t('statsLargestExpense')}</dt>
              <dd>{largest ? money(largest.amount) : '—'}</dd>
            </div>
          </Tiles>
        </TotalCard>

        <Section title={t('statsWhoPaid')}>
          <ChartCard $padded>
            <DonutChart
              label={t('statsWhoPaid')}
              slices={toSlices(members, m => m.paid, theme.chart.series.length, t('statsOther'))}
              currencyCode={currencyCode}
              totalCaption={t('statsTotal')}
              total={stats.totalSpent}
            />
          </ChartCard>
        </Section>

        <Section title={t('statsWhoseSpending')}>
          <ChartCard $padded>
            <Muted>{t('statsWhoseSpendingHint')}</Muted>
            <DonutChart
              label={t('statsWhoseSpending')}
              slices={toSlices(members, m => m.share, theme.chart.series.length, t('statsOther'))}
              currencyCode={currencyCode}
              totalCaption={t('statsTotal')}
              total={stats.totalSpent}
            />
          </ChartCard>
        </Section>

        <Section title={t('statsPaidVsShare')}>
          <ChartCard $padded>
            <Muted>{t('statsPaidVsShareHint')}</Muted>
            <PaidVsShareChart members={members} currencyCode={currencyCode} />
          </ChartCard>
        </Section>

        {months.length > 1 && (
          <Section title={t('statsByMonth')}>
            <ChartCard $padded>
              <MonthlyChart months={months} currencyCode={currencyCode} />
            </ChartCard>
          </Section>
        )}

        <Section title={t('statsLargestExpenses')}>
          <CardList>
            {stats.topExpenses.map(expense => (
              <li key={expense.transactionId}>
                <ListRow
                  to={routes.expense(groupId, expense.transactionId)}
                  title={expense.name}
                  subtitle={formatShortDate(expense.paymentDateUtc)}
                  trailing={<MoneyText>{money(expense.amount)}</MoneyText>}
                />
              </li>
            ))}
          </CardList>
        </Section>
      </>
    );
  };

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;
    if (!current)
      return (
        <EmptyState icon={<ChartPie size={28} />} title={t('statsEmptyTitle')} description={t('statsEmptyDescription')} />
      );

    return (
      <>
        {statistics.length > 1 && (
          <SegmentedControl
            label={t('currency')}
            value={current.currencyCode}
            options={statistics.map(s => ({ value: s.currencyCode, label: s.currencyCode }))}
            onChange={setSelectedCurrency}
          />
        )}
        {renderStatistics(current)}
      </>
    );
  };

  return (
    <Screen topBar={<TopBar title={group?.name ?? t('statsTitle')} back={routes.group(groupId)} />}>
      {renderBody()}
    </Screen>
  );
};

export default GroupStatisticsPage;
