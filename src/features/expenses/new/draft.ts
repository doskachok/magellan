import { toDateInputValue } from 'lib/format';
import type { AmountInputs, SplitMode, SplitState } from '../split';

export type PayerMode = 'single' | 'multiple';

export interface ExpenseDraft {
  step: 0 | 1 | 2;
  groupId: string;
  name: string;
  date: string;
  /** Empty means "use the group's currency". */
  currencyCode: string;
  payerMode: PayerMode;
  /** Empty means "the current user". */
  payerId: string;
  amount: string;
  payerAmounts: AmountInputs;
  split: SplitState;
}

export type DraftAction =
  | { type: 'goTo'; step: ExpenseDraft['step'] }
  | { type: 'selectGroup'; groupId: string }
  | { type: 'update'; patch: Partial<Pick<ExpenseDraft, 'name' | 'date' | 'currencyCode' | 'payerMode' | 'payerId' | 'amount'>> }
  | { type: 'setPayerAmount'; userId: string; value: string }
  | { type: 'setSplitMode'; mode: SplitMode }
  | { type: 'toggleIncluded'; userId: string; included: boolean }
  | { type: 'setSplitValue'; userId: string; value: string };

const emptySplit = (): SplitState => ({ mode: 'equal', included: {}, values: {} });

export const createDraft = (groupId = ''): ExpenseDraft => ({
  step: 0,
  groupId,
  name: '',
  date: toDateInputValue(),
  currencyCode: '',
  payerMode: 'single',
  payerId: '',
  amount: '',
  payerAmounts: {},
  split: emptySplit(),
});

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
  }
};

/** Accepts partially typed decimals such as `12,` or `0.5`, at most two fraction digits. */
export const isAmountInput = (value: string) => /^\d*([.,]\d{0,2})?$/.test(value);
