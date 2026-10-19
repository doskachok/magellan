import { buildAssignments, buildPayerDetails, sumInputs, type SplitState } from './split';
import { SplitMethod } from './types';

// Only how input is encoded is tested here; shares and validation are computed and tested in the API
// (`SplitPreviewer`, `TransactionUtils`).

const members = ['a', 'b', 'c'];

const state = (overrides: Partial<SplitState>): SplitState => ({
  mode: 'equal',
  included: { a: true, b: true, c: true },
  values: {},
  rest: 'none',
  restIncluded: {},
  ...overrides,
});

describe('payers', () => {
  it('sums inputs with comma decimals and ignores empty values', () => {
    expect(sumInputs({ a: '10,50', b: '', c: '0.25' })).toBe(10.75);
  });

  it('drops payers who paid nothing', () => {
    expect(buildPayerDetails({ a: '12', b: '0', c: '' })).toEqual([{ payerId: 'a', amount: 12 }]);
  });
});

describe('equal split', () => {
  it('sends included members only', () => {
    expect(buildAssignments(state({ included: { a: true, b: false, c: true } }), members)).toEqual([
      { userId: 'a', partialAmount: 0, splitMethod: SplitMethod.Equal },
      { userId: 'c', partialAmount: 0, splitMethod: SplitMethod.Equal },
    ]);
  });

  it('includes members that were never toggled', () => {
    expect(buildAssignments(state({ included: {} }), members)).toHaveLength(3);
  });
});

describe('typed values', () => {
  it.each([
    ['amount', SplitMethod.AssignedAmount],
    ['percent', SplitMethod.Percentage],
    ['shares', SplitMethod.Shares],
  ] as const)('sends the %s typed for each member, skipping empty ones', (mode, splitMethod) => {
    expect(buildAssignments(state({ mode, values: { a: '0,5', b: '', c: '2' } }), members)).toEqual([
      { userId: 'a', partialAmount: 0.5, splitMethod },
      { userId: 'c', partialAmount: 2, splitMethod },
    ]);
  });
});

describe('amounts with the rest split', () => {
  it('adds an equal entry for every ticked member, including those without an amount', () => {
    const split = state({ mode: 'amount', values: { a: '30', b: '10' }, rest: 'equal', restIncluded: { b: false } });
    expect(buildAssignments(split, members)).toEqual([
      { userId: 'a', partialAmount: 30, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'b', partialAmount: 10, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'a', partialAmount: 0, splitMethod: SplitMethod.Equal },
      { userId: 'c', partialAmount: 0, splitMethod: SplitMethod.Equal },
    ]);
  });

  it('adds a share weighted by the typed amount for ticked members who have one', () => {
    const split = state({ mode: 'amount', values: { a: '30', b: '10', c: '20' }, rest: 'proportional', restIncluded: { c: false } });
    expect(buildAssignments(split, members)).toEqual([
      { userId: 'a', partialAmount: 30, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'b', partialAmount: 10, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'c', partialAmount: 20, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'a', partialAmount: 30, splitMethod: SplitMethod.Shares },
      { userId: 'b', partialAmount: 10, splitMethod: SplitMethod.Shares },
    ]);
  });

  it('ignores the rest option outside the amount mode', () => {
    expect(buildAssignments(state({ mode: 'shares', values: { a: '1' }, rest: 'equal' }), members)).toHaveLength(1);
  });
});
