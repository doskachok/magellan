import type { User } from 'features/users/types';

/** Mirrors the backend `GroupActivityType` enum. */
export enum ActivityType {
  GroupCreated = 0,
  GroupEdited = 1,
  MemberAdded = 2,
  MemberRemoved = 3,
  MemberLeft = 4,
  PlaceholderAdded = 5,
  PlaceholderReplaced = 6,
  OwnershipTransferred = 7,
  ExpenseAdded = 8,
  ExpenseEdited = 9,
  ExpenseDeleted = 10,
  ExpenseRestored = 11,
  RepaymentAdded = 12,
  RepaymentEdited = 13,
  RepaymentDeleted = 14,
  RepaymentRestored = 15,
  ReceiptAdded = 16,
  ReceiptRemoved = 17,
}

export interface FieldChange {
  field: string;
  /** Missing when the field was empty before. */
  from?: string | null;
  to?: string | null;
}

/** Values are invariant strings (`12.40`, `2026-10-12`); format them for display. */
export interface ActivityDetails {
  name?: string | null;
  changes?: FieldChange[] | null;
  amount?: string | null;
  currency?: string | null;
}

export interface ActivityItem {
  id: string;
  actor: User;
  type: ActivityType;
  transactionId?: string | null;
  /** Who the entry is about; null once a removed placeholder was deleted. */
  subjectUser?: User | null;
  details?: ActivityDetails | null;
  createdAt: string;
  /** A deletion whose expense is still deleted. */
  canRestore: boolean;
}

export const ACTIVITY_PAGE_SIZE = 30;
