import type { User } from 'features/users/types';

export interface GroupListItem {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string | null;
  /** Positive: the group owes you; negative: you owe the group. */
  yourPart: number;
  /** Archived by you; other members may still see it. */
  isArchived: boolean;
}

export interface GroupTransaction {
  id: string;
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
  totalAmount: number;
  yourPart: number;
  /** A repayment between two members rather than an expense. */
  isSettlement: boolean;
  hasNote: boolean;
  receiptCount: number;
}

export interface Group {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string | null;
  ownerId: string;
  participants: User[];
  transactions: GroupTransaction[];
}

export interface Debt {
  lenderId: string;
  lenderName: string;
  lenderAvatarId?: string | null;
  debtorId: string;
  debtorName: string;
  debtorAvatarId?: string | null;
  currencyCode: string;
  amount: number;
}

export interface CreateSettlement {
  debtorId: string;
  lenderId: string;
  currencyCode: string;
  amount: number;
}

export interface SaveGroup {
  id?: string;
  name: string;
  currencyCode: string;
  avatarId?: string | null;
}

export interface MemberStatistics {
  userId: string;
  name: string;
  avatarId?: string | null;
  /** False for people who left the group but still have expenses in it. */
  isParticipant: boolean;
  /** What this member paid for expenses. */
  paid: number;
  /** The part of the spending that was this member's. */
  share: number;
}

export interface MonthlySpending {
  year: number;
  /** 1-12 */
  month: number;
  amount: number;
  expenseCount: number;
}

export interface ExpenseSummary {
  transactionId: string;
  name: string;
  paymentDateUtc: string;
  amount: number;
}

/** Spending of a group in one currency; repayments are not spending, so they are left out. */
export interface CurrencyStatistics {
  currencyCode: string;
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  firstExpenseDateUtc: string;
  lastExpenseDateUtc: string;
  /** Current members first, in group order — a stable order to colour them by. */
  members: MemberStatistics[];
  /** Every month from the first expense to the last, empty months included. */
  monthly: MonthlySpending[];
  /** The largest expenses, largest first. */
  topExpenses: ExpenseSummary[];
}
