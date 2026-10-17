import { parseAmount, roundMoney } from 'lib/format';
import type { CreateSettlement, Debt } from './types';

export type SettlementIssue = 'amountRequired' | 'amountOverDebt';

/**
 * Mirrors the API's settlement rules: a positive amount, at most the current debt
 * (settling more would turn the debt around).
 */
export const settlementIssue = (input: string, debtAmount: number): SettlementIssue | null => {
  const amount = roundMoney(parseAmount(input));
  if (amount <= 0) return 'amountRequired';
  if (amount > roundMoney(debtAmount)) return 'amountOverDebt';
  return null;
};

export const toSettlement = (debt: Debt, input: string): CreateSettlement => ({
  debtorId: debt.debtorId,
  lenderId: debt.lenderId,
  currencyCode: debt.currencyCode,
  amount: roundMoney(parseAmount(input)),
});
