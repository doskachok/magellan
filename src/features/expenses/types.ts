export interface ICreateTransaction {
  name: string;
  paymentDateUtc: string;
  currencyCode: string;
  groupId: string;
  payerDetails: IPayerDetails[];
  partialsAssignments: IPartialAssignments[];
}

export interface IPayerDetails {
  payerId: string;
  amount: number;
}

export enum SplitType {
  AssignedAmount = 0,
  Percentage = 1,
  Equal = 2,
  Shares = 3,
}

export interface IPartialAssignments {
  userId: string;
  partialAmount: number;
  splitType: SplitType;
}