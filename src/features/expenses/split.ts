import { parseAmount, roundMoney } from 'lib/format';
import { SplitMethod, type PartialAssignment, type PayerDetail } from './types';

export type SplitMode = 'equal' | 'amount' | 'percent' | 'shares';

export const SPLIT_MODES: SplitMode[] = ['equal', 'amount', 'percent', 'shares'];

const MODE_TO_METHOD: Record<SplitMode, SplitMethod> = {
  equal: SplitMethod.Equal,
  amount: SplitMethod.AssignedAmount,
  percent: SplitMethod.Percentage,
  shares: SplitMethod.Shares,
};

/** How the amount left after fixed amounts is shared out in the `amount` mode. */
export type RestMode = 'none' | 'equal' | 'proportional';

/** Raw text input per user id, as typed. */
export type AmountInputs = Record<string, string>;

export interface SplitState {
  mode: SplitMode;
  /** Who takes part in an equal split; members not listed are included. */
  included: Record<string, boolean>;
  /** Amount / percent / share inputs for the other modes. */
  values: AmountInputs;
  /** `amount` mode only: who shares the unassigned rest, and how. */
  rest: RestMode;
  /** Who takes part in sharing the rest; members not listed are included. */
  restIncluded: Record<string, boolean>;
}

/** Why the API won't save a split yet; mirrors `SplitIssue` / `SplitIssueKind` in the API. */
export interface SplitIssue {
  kind: 'noPayers' | 'noParticipants' | 'noShares' | 'amountMismatch' | 'percentMismatch' | 'invalidSplit';
  /** Money (amountMismatch) or percent (percentMismatch) left to assign; negative when over. */
  remaining?: number | null;
}

/** The API's answer to `POST transactions/preview`: what everyone pays, computed exactly as on save. */
export interface SplitPreview {
  shares: { userId: string; partialAmount: number }[];
  issue: SplitIssue | null;
}

export interface SplitPreviewRequest {
  payerDetails: PayerDetail[];
  partialsAssignments: PartialAssignment[];
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const sumInputs = (inputs: AmountInputs) => roundMoney(sum(Object.values(inputs).map(parseAmount)));

export const buildPayerDetails = (inputs: AmountInputs): PayerDetail[] =>
  Object.entries(inputs)
    .map(([payerId, value]) => ({ payerId, amount: roundMoney(parseAmount(value)) }))
    .filter(payer => payer.amount > 0);

const activeParticipants = (state: SplitState, memberIds: string[]) =>
  state.mode === 'equal'
    ? memberIds.filter(id => state.included[id] ?? true)
    : memberIds.filter(id => parseAmount(state.values[id] ?? '') > 0);

/**
 * Turns what was typed into the assignments the API stores. No maths happens here: shares, totals
 * and whether the split adds up all come from the API (`SplitPreview`, and validation on save).
 *
 * In the `amount` mode a rest is sent as a mixed split: everyone keeps their `AssignedAmount`, and
 * the ticked members get an extra `Equal` entry, or a `Shares` entry weighted by the amount they
 * typed (members without an amount have no weight, so they're left out). When nothing is left, the
 * API drops those extra entries on save.
 */
export const buildAssignments = (state: SplitState, memberIds: string[]): PartialAssignment[] => {
  const amount = (id: string) => parseAmount(state.values[id] ?? '');
  const assignments = activeParticipants(state, memberIds).map(userId => ({
    userId,
    splitMethod: MODE_TO_METHOD[state.mode],
    partialAmount: state.mode === 'equal' ? 0 : amount(userId),
  }));

  if (state.mode !== 'amount' || state.rest === 'none') return assignments;

  const ticked = memberIds.filter(id => state.restIncluded[id] ?? true);
  const rest =
    state.rest === 'equal'
      ? ticked.map(userId => ({ userId, splitMethod: SplitMethod.Equal, partialAmount: 0 }))
      : ticked.filter(id => amount(id) > 0).map(userId => ({ userId, splitMethod: SplitMethod.Shares, partialAmount: amount(userId) }));
  return [...assignments, ...rest];
};
