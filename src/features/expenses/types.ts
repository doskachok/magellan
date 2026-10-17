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

export interface Transaction {
  id: string;
  ownerId: string;
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
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
  payerDetails: PayerDetail[];
  partialsAssignments: PartialAssignment[];
}
