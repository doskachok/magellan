import { toDateInputValue } from 'lib/format';
import type { AmountInputs, SplitMode, SplitState } from '../split';
import { SplitMethod, type Transaction } from '../types';

export type PayerMode = 'single' | 'multiple';

export const NOTE_MAX_LENGTH = 500;

/** A receipt picked in the form, uploaded once the expense is saved. */
export interface PendingReceipt {
  key: string;
  file: File;
}

export interface ExpenseDraft {
  step: 0 | 1 | 2;
  groupId: string;
  name: string;
  date: string;
  /** Empty means "use the group's currency". */
  currencyCode: string;
  /** Optional; empty means no note. */
  note: string;
  payerMode: PayerMode;
  /** Empty means "the current user". */
  payerId: string;
  amount: string;
  payerAmounts: AmountInputs;
  split: SplitState;
  /** Optional receipts to upload on save. */
  receipts: PendingReceipt[];
  /** Already stored receipts to remove on save (editing only). */
  removedReceiptIds: string[];
}

export type DraftAction =
  | { type: 'goTo'; step: ExpenseDraft['step'] }
  | { type: 'selectGroup'; groupId: string }
  | { type: 'update'; patch: Partial<Pick<ExpenseDraft, 'name' | 'date' | 'currencyCode' | 'note' | 'payerMode' | 'payerId' | 'amount'>> }
  | { type: 'setPayerAmount'; userId: string; value: string }
  | { type: 'setSplitMode'; mode: SplitMode }
  | { type: 'toggleIncluded'; userId: string; included: boolean }
  | { type: 'setSplitValue'; userId: string; value: string }
  | { type: 'addReceipts'; files: File[] }
  | { type: 'removeReceipt'; key: string }
  | { type: 'removeStoredReceipt'; receiptId: string };

const emptySplit = (): SplitState => ({ mode: 'equal', included: {}, values: {} });

export const createDraft = (groupId = ''): ExpenseDraft => ({
  step: 0,
  groupId,
  name: '',
  date: toDateInputValue(),
  currencyCode: '',
  note: '',
  payerMode: 'single',
  payerId: '',
  amount: '',
  payerAmounts: {},
  split: emptySplit(),
  receipts: [],
  removedReceiptIds: [],
});

const METHOD_TO_MODE: Record<number, SplitMode> = {
  [SplitMethod.Equal]: 'equal',
  [SplitMethod.AssignedAmount]: 'amount',
  [SplitMethod.Percentage]: 'percent',
  [SplitMethod.Shares]: 'shares',
};

const money = (value: number) => value.toFixed(2);

/** The draft that saving unchanged would turn back into the same expense. */
export const draftFromExpense = (expense: Transaction, groupId: string, memberIds: string[]): ExpenseDraft => {
  const single = expense.payerDetails.length === 1;
  const mode = METHOD_TO_MODE[expense.partialsAssignments[0]?.splitMethod ?? SplitMethod.Equal] ?? 'equal';
  const assignees = new Set(expense.partialsAssignments.map(part => part.userId));

  return {
    ...createDraft(groupId),
    name: expense.name,
    date: toDateInputValue(new Date(expense.paymentDateUtc)),
    currencyCode: expense.currencyCode,
    note: expense.note ?? '',
    payerMode: single ? 'single' : 'multiple',
    payerId: single ? expense.payerDetails[0].payerId : '',
    amount: single ? money(expense.payerDetails[0].amount) : '',
    payerAmounts: single ? {} : Object.fromEntries(expense.payerDetails.map(payer => [payer.payerId, money(payer.amount)])),
    split:
      mode === 'equal'
        ? { mode, included: Object.fromEntries(memberIds.map(id => [id, assignees.has(id)])), values: {} }
        : {
            mode,
            included: {},
            values: Object.fromEntries(
              expense.partialsAssignments.map(part => [part.userId, mode === 'amount' ? money(part.partialAmount) : String(part.partialAmount)]),
            ),
          },
  };
};

export const draftReducer = (draft: ExpenseDraft, action: DraftAction): ExpenseDraft => {
  switch (action.type) {
    case 'goTo':
      return { ...draft, step: action.step };
    case 'selectGroup':
      // Payers and participants belong to the group, so a different group starts them over.
      return { ...draft, groupId: action.groupId, currencyCode: '', payerId: '', payerAmounts: {}, split: emptySplit() };
    case 'update':
      return { ...draft, ...action.patch };
    case 'setPayerAmount':
      return { ...draft, payerAmounts: { ...draft.payerAmounts, [action.userId]: action.value } };
    case 'setSplitMode':
      return { ...draft, split: { ...draft.split, mode: action.mode, values: {} } };
    case 'toggleIncluded':
      return { ...draft, split: { ...draft.split, included: { ...draft.split.included, [action.userId]: action.included } } };
    case 'setSplitValue':
      return { ...draft, split: { ...draft.split, values: { ...draft.split.values, [action.userId]: action.value } } };
    case 'addReceipts':
      return { ...draft, receipts: [...draft.receipts, ...action.files.map(file => ({ key: crypto.randomUUID(), file }))] };
    case 'removeReceipt':
      return { ...draft, receipts: draft.receipts.filter(receipt => receipt.key !== action.key) };
    case 'removeStoredReceipt':
      return { ...draft, removedReceiptIds: [...draft.removedReceiptIds, action.receiptId] };
  }
};

/** Accepts partially typed decimals such as `12,` or `0.5`, at most two fraction digits. */
export const isAmountInput = (value: string) => /^\d*([.,]\d{0,2})?$/.test(value);
