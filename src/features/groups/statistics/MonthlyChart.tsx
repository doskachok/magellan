import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

import { formatMoney, formatMonth } from 'lib/format';
import type { MonthlySpending } from '../types';

const PLOT_HEIGHT = 140;

const Readout = styled.p`
  min-height: 2.9em;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ReadoutValue = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
`;

const Plot = styled.div`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 2px;
  align-items: end;
  height: ${PLOT_HEIGHT}px;
  margin-top: ${({ theme }) => theme.space(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const rise = keyframes`
  from { transform: scaleY(0); }
`;

/** The whole column is the hit target, so short bars are as easy to hover as tall ones. */
const Column = styled.button`
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding: 0 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  /* Bars rise left to right; the column is animated (not the bar) so sibling-index() can stagger it. */
  transform-origin: bottom;
  animation: ${rise} 500ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
  animation-delay: calc((sibling-index() - 1) * 30ms);
`;

const Bar = styled.span<{ $height: number; $active: boolean }>`
  width: 100%;
  height: ${({ $height }) => $height}%;
  min-height: ${({ $height }) => ($height > 0 ? '2px' : '0')};
  border-radius: 4px 4px 0 0;
  background: ${({ theme, $active }) => ($active ? theme.colors.brandPressed : theme.colors.brand)};
  transition:
    background ${({ theme }) => theme.motion.fast},
    height ${({ theme }) => theme.motion.enter};
`;

const Labels = styled.div`
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 2px;
  margin-top: ${({ theme }) => theme.space(1)};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

interface MonthlyChartProps {
  months: MonthlySpending[];
  currencyCode: string;
}

/** Spending per month; hovering or focusing a bar shows its value above the plot. */
export const MonthlyChart = ({ months, currencyCode }: MonthlyChartProps) => {
  const { t } = useTranslation('groups');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const max = Math.max(...months.map(m => m.amount), 0);
  // Without hover, the readout shows the latest month.
  const shown = months[activeIndex ?? months.length - 1]!;
  // Label every month while they fit; otherwise every other one.
  const labelEvery = months.length > 8 ? 2 : 1;

  return (
    <div>
      <Readout aria-live="polite">
        {formatMonth(shown.year, shown.month, true)} · {t('statsExpenseCount', { count: shown.expenseCount })}
        <ReadoutValue>{formatMoney(shown.amount, currencyCode)}</ReadoutValue>
      </Readout>
      <Plot>
        {months.map((month, index) => (
          <Column
            key={`${month.year}-${month.month}`}
            type="button"
            aria-label={`${formatMonth(month.year, month.month, true)}: ${formatMoney(month.amount, currencyCode)}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
          >
            <Bar $height={max ? (month.amount / max) * 100 : 0} $active={index === activeIndex} />
          </Column>
        ))}
      </Plot>
      <Labels aria-hidden>
        {months.map((month, index) => (
          <span key={`${month.year}-${month.month}`}>
            {(months.length - 1 - index) % labelEvery === 0 ? formatMonth(month.year, month.month) : ''}
          </span>
        ))}
      </Labels>
    </div>
  );
};
