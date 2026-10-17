import { buildAssignments, buildPayerDetails, evaluateSplit, sumInputs, type SplitState } from './split';
import { SplitMethod } from './types';

const members = ['a', 'b', 'c'];

const state = (overrides: Partial<SplitState>): SplitState => ({
  mode: 'equal',
  included: { a: true, b: true, c: true },
  values: {},
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
  it('divides the total between included members only', () => {
    const split = state({ included: { a: true, b: false, c: true } });
    expect(evaluateSplit(split, members, 30)).toEqual({ shares: { a: 15, b: 0, c: 15 }, issue: null });
    expect(buildAssignments(split, members)).toEqual([
      { userId: 'a', partialAmount: 0, splitMethod: SplitMethod.Equal },
      { userId: 'c', partialAmount: 0, splitMethod: SplitMethod.Equal },
    ]);
  });

  it('includes members that were never toggled', () => {
    expect(evaluateSplit(state({ included: {} }), members, 30).shares).toEqual({ a: 10, b: 10, c: 10 });
  });

  it('requires at least one participant', () => {
    const split = state({ included: { a: false, b: false, c: false } });
    expect(evaluateSplit(split, members, 30).issue).toEqual({ kind: 'noParticipants' });
  });
});

describe('exact amounts', () => {
  it('reports what is left to assign', () => {
    const split = state({ mode: 'amount', values: { a: '10', b: '5.5' } });
    expect(evaluateSplit(split, members, 20).issue).toEqual({ kind: 'amountMismatch', remaining: 4.5 });
  });

  it('reports the whole total as left before anything is entered', () => {
    const split = state({ mode: 'amount', values: {} });
    expect(evaluateSplit(split, members, 20).issue).toEqual({ kind: 'amountMismatch', remaining: 20 });
  });

  it('accepts amounts that add up despite floating point noise', () => {
    const split = state({ mode: 'amount', values: { a: '0.1', b: '0.2' } });
    expect(evaluateSplit(split, members, 0.3).issue).toBeNull();
    expect(buildAssignments(split, members)).toEqual([
      { userId: 'a', partialAmount: 0.1, splitMethod: SplitMethod.AssignedAmount },
      { userId: 'b', partialAmount: 0.2, splitMethod: SplitMethod.AssignedAmount },
    ]);
  });
});

describe('percentages', () => {
  it('must add up to 100', () => {
    expect(evaluateSplit(state({ mode: 'percent', values: { a: '50', b: '30' } }), members, 10).issue).toEqual({
      kind: 'percentMismatch',
      remaining: 20,
    });
    const valid = evaluateSplit(state({ mode: 'percent', values: { a: '33.33', b: '33.33', c: '33.34' } }), members, 100);
    expect(valid.issue).toBeNull();
    expect(valid.shares.c).toBeCloseTo(33.34);
  });

  it('reports 100% left before anything is entered', () => {
    expect(evaluateSplit(state({ mode: 'percent', values: {} }), members, 10).issue).toEqual({
      kind: 'percentMismatch',
      remaining: 100,
    });
  });
});

describe('shares', () => {
  it('splits proportionally', () => {
    const result = evaluateSplit(state({ mode: 'shares', values: { a: '2', b: '1' } }), members, 90);
    expect(result).toEqual({ shares: { a: 60, b: 30, c: 0 }, issue: null });
  });

  it('needs at least one share', () => {
    expect(evaluateSplit(state({ mode: 'shares', values: {} }), members, 90).issue).toEqual({ kind: 'noShares' });
  });
});
