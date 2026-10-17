/** Mirrors the backend `SplitMethod` enum. */
export enum SplitMethod {
  AssignedAmount = 0,
  Percentage = 1,
  Equal = 2,
  Shares = 3,
}

export interface PayerDetail {
  payerId: string;
  amount: number;
}

export interface PartialAssignment {
  userId: string;
  partialAmount: number;
  splitMethod: SplitMethod;
}

export interface Receipt {
  id: string;
  fileName: string;
  contentType: string;
  /** Bytes */
  size: number;
}

export interface Transaction {
  id: string;
  ownerId: string;
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
  /** A repayment between two members rather than an expense. */
  isSettlement: boolean;
  note?: string | null;
  /** Someone in it left the group, so it can't be edited, deleted or restored. */
  isLocked: boolean;
  receipts: Receipt[];
  payerDetails: PayerDetail[];
  partialsAssignments: PartialAssignment[];
  /** Every participant's share converted to an absolute amount. */
  partialsAssignmentsTranslated: Omit<PartialAssignment, 'splitMethod'>[];
}

export interface CreateTransaction {
  groupId: string;
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
  note?: string | null;
  payerDetails: PayerDetail[];
  partialsAssignments: PartialAssignment[];
}

export interface UpdateTransaction extends CreateTransaction {
  id: string;
}

/** Identifies an expense together with the group whose caches it touches. */
export interface TransactionRef {
  id: string;
  groupId: string;
}
