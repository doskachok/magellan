import { formatMoney, roundMoney } from 'lib/format';
import type { Debt } from './types';

export interface OpenBalance {
  currencyCode: string;
  /** Positive: others owe this person; negative: this person owes. */
  amount: number;
}

/** What a person still has to settle, per currency. Leaving or removing them needs this to be empty. */
export const openBalances = (debts: Debt[], userId: string): OpenBalance[] => {
  const byCurrency = new Map<string, number>();
  for (const debt of debts) {
    const delta = debt.lenderId === userId ? debt.amount : debt.debtorId === userId ? -debt.amount : 0;
    if (delta !== 0) byCurrency.set(debt.currencyCode, (byCurrency.get(debt.currencyCode) ?? 0) + delta);
  }
  return [...byCurrency]
    .map(([currencyCode, amount]) => ({ currencyCode, amount: roundMoney(amount) }))
    .filter(balance => balance.amount !== 0);
};

/** e.g. `owes €12.40, is owed $5.00` */
export const formatBalances = (balances: OpenBalance[], words: { owes: string; owed: string }) =>
  balances
    .map(balance => `${balance.amount < 0 ? words.owes : words.owed} ${formatMoney(Math.abs(balance.amount), balance.currencyCode)}`)
    .join(', ');
