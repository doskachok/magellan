import { formatBalances, openBalances } from './memberBalance';
import type { Debt } from './types';

const debt = (debtorId: string, lenderId: string, amount: number, currencyCode = 'EUR'): Debt => ({
  debtorId,
  lenderId,
  debtorName: debtorId,
  lenderName: lenderId,
  currencyCode,
  amount,
});

describe('openBalances', () => {
  it('is empty when nobody owes anything', () => {
    expect(openBalances([], 'bob')).toEqual([]);
  });

  it('lists every currency the person still owes or is owed in', () => {
    const debts = [debt('bob', 'alice', 12.4), debt('carol', 'bob', 5, 'USD')];

    expect(openBalances(debts, 'bob')).toEqual([
      { currencyCode: 'EUR', amount: -12.4 },
      { currencyCode: 'USD', amount: 5 },
    ]);
  });

  it('ignores debts between other people', () => {
    expect(openBalances([debt('carol', 'alice', 10)], 'bob')).toEqual([]);
  });

  it('nets debts in the same currency', () => {
    expect(openBalances([debt('bob', 'alice', 10), debt('carol', 'bob', 4)], 'bob')).toEqual([{ currencyCode: 'EUR', amount: -6 }]);
  });
});

describe('formatBalances', () => {
  it('says who owes and who is owed', () => {
    expect(formatBalances([{ currencyCode: 'EUR', amount: -12.4 }, { currencyCode: 'USD', amount: 5 }], { owes: 'owes', owed: 'is owed' })).toBe(
      'owes €12.40, is owed $5.00',
    );
  });
});
