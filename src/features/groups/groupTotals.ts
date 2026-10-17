import { formatMoney } from 'lib/format';
import type { GroupListItem } from './types';

/** Totals per currency — balances in different currencies can't be summed together. */
export const sumByCurrency = (groups: GroupListItem[], predicate: (amount: number) => boolean) => {
  const totals = new Map<string, number>();
  for (const group of groups) {
    if (predicate(group.yourPart)) totals.set(group.currencyCode, (totals.get(group.currencyCode) ?? 0) + group.yourPart);
  }
  return [...totals].map(([currency, amount]) => formatMoney(Math.abs(amount), currency));
};
