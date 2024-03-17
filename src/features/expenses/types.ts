export interface ITransaction {
  id: string;
  ownerId: string;
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
  payerDetails: IPayerDetails[];
  partialsAssignments: IPartialAssignments[];
}

export interface ITransactionView extends ITransaction {
  partialsAssignmentsTranslated: IPartialAssignmentsTranslated[];
}

export interface ICreateTransaction extends Omit<ITransaction, 'id' | 'ownerId'> {
  groupId: string;
}

export interface IPayerDetails {
  payerId: string;
  amount: number;
}

export enum SplitMethod {
  AssignedAmount = 0,
  Percentage = 1,
  Equal = 2,
  Shares = 3,
}

export interface IPartialAssignments {
  userId: string;
  partialAmount: number;
  splitMethod: SplitMethod;
}

export interface IPartialAssignmentsTranslated extends Omit<IPartialAssignments, 'splitMethod'> {
}