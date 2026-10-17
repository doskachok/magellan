import { settlementIssue, toSettlement } from './settlement';
import type { Debt } from './types';

const debt: Debt = {
  lenderId: 'alice',
  lenderName: 'Alice',
  debtorId: 'bob',
  debtorName: 'Bob',
  currencyCode: 'EUR',
  amount: 25,
};

describe('settlementIssue', () => {
  it('accepts the full debt', () => {
    expect(settlementIssue('25', debt.amount)).toBeNull();
  });

  it('accepts a partial repayment, including a comma decimal separator', () => {
    expect(settlementIssue('10,50', debt.amount)).toBeNull();
  });

  it.each(['', '0', '0.00'])('requires a positive amount (%j)', input => {
    expect(settlementIssue(input, debt.amount)).toBe('amountRequired');
  });

  it('rejects more than is owed', () => {
    expect(settlementIssue('25.01', debt.amount)).toBe('amountOverDebt');
  });

  it('ignores sub-cent noise in the debt amount', () => {
    expect(settlementIssue('33.33', 33.333333)).toBeNull();
  });
});

describe('toSettlement', () => {
  it('turns the debt and entered amount into the API request', () => {
    expect(toSettlement(debt, '10,5')).toEqual({
      debtorId: 'bob',
      lenderId: 'alice',
      currencyCode: 'EUR',
      amount: 10.5,
    });
  });
});
