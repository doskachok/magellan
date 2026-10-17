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

/** Raw text input per user id, as typed. */
export type AmountInputs = Record<string, string>;

export interface SplitState {
  mode: SplitMode;
  /** Who takes part in an equal split; members not listed are included. */
  included: Record<string, boolean>;
  /** Amount / percent / share inputs for the other modes. */
  values: AmountInputs;
}

export type SplitIssue =
  | { kind: 'noParticipants' }
  | { kind: 'amountMismatch'; remaining: number }
  | { kind: 'percentMismatch'; remaining: number }
  | { kind: 'noShares' };

export interface SplitResult {
  /** Each participant's resulting amount, for preview. */
  shares: Record<string, number>;
  issue: SplitIssue | null;
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

export const buildAssignments = (state: SplitState, memberIds: string[]): PartialAssignment[] =>
  activeParticipants(state, memberIds).map(userId => ({
    userId,
    splitMethod: MODE_TO_METHOD[state.mode],
    partialAmount: state.mode === 'equal' ? 0 : parseAmount(state.values[userId] ?? ''),
  }));

/**
 * Previews each person's share and reports what blocks saving. Rules mirror the API's
 * `TransactionUtils.AmountCheck`: amounts must add up to the total, percentages to 100,
 * shares must be positive, and someone has to take part.
 */
export const evaluateSplit = (state: SplitState, memberIds: string[], total: number): SplitResult => {
  const participants = activeParticipants(state, memberIds);
  const value = (id: string) => parseAmount(state.values[id] ?? '');
  const shares: Record<string, number> = Object.fromEntries(memberIds.map(id => [id, 0]));

  if (participants.length === 0) {
    const issue: Record<SplitMode, SplitIssue> = {
      equal: { kind: 'noParticipants' },
      amount: { kind: 'amountMismatch', remaining: total },
      percent: { kind: 'percentMismatch', remaining: 100 },
      shares: { kind: 'noShares' },
    };
    return { shares, issue: issue[state.mode] };
  }

  switch (state.mode) {
    case 'equal': {
      for (const id of participants) shares[id] = total / participants.length;
      return { shares, issue: null };
    }
    case 'amount': {
      for (const id of participants) shares[id] = value(id);
      const remaining = roundMoney(total - sum(participants.map(value)));
      return { shares, issue: remaining === 0 ? null : { kind: 'amountMismatch', remaining } };
    }
    case 'percent': {
      for (const id of participants) shares[id] = (total * value(id)) / 100;
      const remaining = roundMoney(100 - sum(participants.map(value)));
      return { shares, issue: remaining === 0 ? null : { kind: 'percentMismatch', remaining } };
    }
    case 'shares': {
      const totalShares = sum(participants.map(value));
      for (const id of participants) shares[id] = (total * value(id)) / totalShares;
      return { shares, issue: null };
    }
  }
};
