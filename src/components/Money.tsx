import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatMoney, toneOf, type Tone } from 'lib/format';

const Root = styled.span<{ $tone: Tone; $align: 'left' | 'right' }>`
  display: inline-flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'right' ? 'flex-end' : 'flex-start')};
  color: ${({ theme, $tone }) =>
    $tone === 'positive' ? theme.colors.positive : $tone === 'negative' ? theme.colors.negative : theme.colors.textMuted};
`;

const Caption = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
`;

const Amount = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
`;

interface BalanceProps {
  /** Positive: you are owed / you lent; negative: you owe / you borrowed. */
  amount: number;
  currencyCode: string;
  variant?: 'balance' | 'expense';
  align?: 'left' | 'right';
}

/** A signed balance rendered as words + amount, so meaning never relies on colour alone. */
export const Balance = ({ amount, currencyCode, variant = 'balance', align = 'right' }: BalanceProps) => {
  const { t } = useTranslation();
  const tone = toneOf(amount);

  const captions = {
    balance: { positive: t('youAreOwed'), negative: t('youOwe'), neutral: t('settledUp') },
    expense: { positive: t('youLent'), negative: t('youBorrowed'), neutral: t('notInvolved') },
  }[variant];

  return (
    <Root $tone={tone} $align={align}>
      <Caption>{captions[tone]}</Caption>
      {tone !== 'neutral' && <Amount>{formatMoney(Math.abs(amount), currencyCode)}</Amount>}
    </Root>
  );
};
