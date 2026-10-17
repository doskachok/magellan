import { buildAssignments, buildPayerDetails } from '../split';
import { SplitMethod, type Transaction } from '../types';
import { draftFromExpense, draftReducer, type ExpenseDraft } from './draft';

const members = ['alice', 'bob', 'carol'];

const expense = (overrides: Partial<Transaction>): Transaction => ({
  id: 'e1',
  ownerId: 'alice',
  name: 'Dinner',
  paymentDateUtc: new Date('2026-10-12T12:00:00').toISOString(),
  currencyCode: 'EUR',
  isSettlement: false,
  note: null,
  isLocked: false,
  receipts: [],
  payerDetails: [{ payerId: 'alice', amount: 30 }],
  partialsAssignments: [],
  partialsAssignmentsTranslated: [],
  ...overrides,
});

// What NewExpensePage sends for a draft.
const roundTrip = (draft: ExpenseDraft) => ({
  payerDetails: buildPayerDetails(draft.payerMode === 'single' ? { [draft.payerId]: draft.amount } : draft.payerAmounts),
  partialsAssignments: buildAssignments(draft.split, members),
});

describe('draftFromExpense', () => {
  it('prefills the details and starts at the first step', () => {
    const draft = draftFromExpense(expense({ note: 'Birthday' }), 'g1', members);

    expect(draft).toMatchObject({ step: 0, groupId: 'g1', name: 'Dinner', date: '2026-10-12', currencyCode: 'EUR', note: 'Birthday' });
    expect(draft.receipts).toEqual([]);
  });

  it('round-trips an equal split with someone left out', () => {
    const original = expense({
      partialsAssignments: [
        { userId: 'alice', partialAmount: 0, splitMethod: SplitMethod.Equal },
        { userId: 'carol', partialAmount: 0, splitMethod: SplitMethod.Equal },
      ],
    });

    const draft = draftFromExpense(original, 'g1', members);

    expect(draft.split.mode).toBe('equal');
    expect(roundTrip(draft)).toEqual({ payerDetails: original.payerDetails, partialsAssignments: original.partialsAssignments });
  });

  it.each([
    ['amount', SplitMethod.AssignedAmount, [10.5, 19.5]],
    ['percent', SplitMethod.Percentage, [40, 60]],
    ['shares', SplitMethod.Shares, [1, 2]],
  ] as const)('round-trips a %s split', (mode, splitMethod, [first, second]) => {
    const original = expense({
      partialsAssignments: [
        { userId: 'alice', partialAmount: first, splitMethod },
        { userId: 'bob', partialAmount: second, splitMethod },
      ],
    });

    const draft = draftFromExpense(original, 'g1', members);

    expect(draft.split.mode).toBe(mode);
    expect(roundTrip(draft)).toEqual({ payerDetails: original.payerDetails, partialsAssignments: original.partialsAssignments });
  });

  it('round-trips several payers', () => {
    const original = expense({
      payerDetails: [
        { payerId: 'alice', amount: 20 },
        { payerId: 'bob', amount: 12.4 },
      ],
      partialsAssignments: [{ userId: 'carol', partialAmount: 0, splitMethod: SplitMethod.Equal }],
    });

    const draft = draftFromExpense(original, 'g1', members);

    expect(draft.payerMode).toBe('multiple');
    expect(roundTrip(draft).payerDetails).toEqual(original.payerDetails);
  });

  describe('keeps the picked calendar day', () => {
    const originalTz = process.env.TZ;
    afterEach(() => {
      process.env.TZ = originalTz;
    });

    it.each(['Pacific/Kiritimati', 'Pacific/Pago_Pago', 'Europe/Kyiv'])('in %s', timeZone => {
      process.env.TZ = timeZone;
      // Created the way NewExpensePage sends dates: local noon of the chosen day.
      const paymentDateUtc = new Date('2026-10-12T12:00:00').toISOString();

      expect(draftFromExpense(expense({ paymentDateUtc }), 'g1', members).date).toBe('2026-10-12');
    });
  });
});

describe('draftReducer receipts', () => {
  const file = (name: string) => new File(['x'], name, { type: 'image/png' });

  it('adds and removes pending receipts', () => {
    const start = draftFromExpense(expense({}), 'g1', members);
    const added = draftReducer(start, { type: 'addReceipts', files: [file('a.png'), file('b.png')] });

    expect(added.receipts.map(receipt => receipt.file.name)).toEqual(['a.png', 'b.png']);

    const removed = draftReducer(added, { type: 'removeReceipt', key: added.receipts[0].key });
    expect(removed.receipts.map(receipt => receipt.file.name)).toEqual(['b.png']);
  });

  it('marks stored receipts for removal on save', () => {
    const start = draftFromExpense(expense({}), 'g1', members);

    expect(draftReducer(start, { type: 'removeStoredReceipt', receiptId: 'r1' }).removedReceiptIds).toEqual(['r1']);
  });
});
