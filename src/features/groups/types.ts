import type { User } from 'features/users/types';

export interface GroupListItem {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string | null;
  /** Positive: the group owes you; negative: you owe the group. */
  yourPart: number;
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
