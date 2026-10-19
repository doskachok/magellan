import { toDateInputValue } from 'lib/format';
import type { AmountInputs, RestMode, SplitMode, SplitState } from '../split';
import { SplitMethod, type PartialAssignment, type Transaction } from '../types';

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
  | { type: 'setSplitRest'; rest: RestMode }
  | { type: 'toggleRestIncluded'; userId: string; included: boolean }
  | { type: 'addReceipts'; files: File[] }
  | { type: 'removeReceipt'; key: string }
  | { type: 'removeStoredReceipt'; receiptId: string };

const emptySplit = (): SplitState => ({ mode: 'equal', included: {}, values: {}, rest: 'none', restIncluded: {} });

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

/**
 * Reads the split back from assignments. Fixed amounts mixed with `Equal` or `Shares` entries are the
 * `amount` mode with its rest shared equally or proportionally (see `buildAssignments`).
 */
const splitFromAssignments = (parts: PartialAssignment[], memberIds: string[]): SplitState => {
  const fixed = parts.filter(part => part.splitMethod === SplitMethod.AssignedAmount);
  const others = parts.filter(part => part.splitMethod !== SplitMethod.AssignedAmount);
  const mode = fixed.length ? 'amount' : (METHOD_TO_MODE[others[0]?.splitMethod ?? SplitMethod.Equal] ?? 'equal');
  // Only members with an amount take part in a proportional rest, so the others are left ticked.
  const withAmount = new Set(fixed.map(part => part.userId));
  const selected = (users: PartialAssignment[]) => {
    const ids = new Set(users.map(part => part.userId));
    const proportional = users.some(part => part.splitMethod === SplitMethod.Shares) && fixed.length > 0;
    return Object.fromEntries(memberIds.map(id => [id, ids.has(id) || (proportional && !withAmount.has(id))]));
  };

  if (mode === 'equal') return { ...emptySplit(), mode, included: selected(parts) };

  const rest: RestMode =
    !fixed.length || !others.length ? 'none' : others[0].splitMethod === SplitMethod.Shares ? 'proportional' : 'equal';
  return {
    ...emptySplit(),
    mode,
    values: Object.fromEntries((fixed.length ? fixed : others).map(part => [part.userId, mode === 'amount' ? money(part.partialAmount) : String(part.partialAmount)])),
    rest,
    restIncluded: rest === 'none' ? {} : selected(others),
  };
};

/** The draft that saving unchanged would turn back into the same expense. */
export const draftFromExpense = (expense: Transaction, groupId: string, memberIds: string[]): ExpenseDraft => {
  const single = expense.payerDetails.length === 1;

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
    split: splitFromAssignments(expense.partialsAssignments, memberIds),
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
      return { ...draft, split: { ...draft.split, mode: action.mode, values: {}, rest: 'none', restIncluded: {} } };
    case 'toggleIncluded':
      return { ...draft, split: { ...draft.split, included: { ...draft.split.included, [action.userId]: action.included } } };
    case 'setSplitValue':
      return { ...draft, split: { ...draft.split, values: { ...draft.split.values, [action.userId]: action.value } } };
    case 'setSplitRest':
      return { ...draft, split: { ...draft.split, rest: action.rest } };
    case 'toggleRestIncluded':
      return { ...draft, split: { ...draft.split, restIncluded: { ...draft.split.restIncluded, [action.userId]: action.included } } };
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
