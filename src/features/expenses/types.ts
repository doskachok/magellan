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

export interface IPartialAssignments {
  userId: string;
  partialAmount: number;
  splitType: number; // TODO: introduce enum
}