export interface ITransactionGroupListItem {
  id: string;
  name: string;
  currencyCode: string;
  yourPart: number;
}

export interface ITransactionGroup {
  id: string;
  name: string;
  currencyCode: string;
  participants: string[];
  ownerId: string;
  transactions:ITransaction[];
}

export interface ITransaction {
  id: string;
  name: string;
  paymentDateUtc: Date;
  currencyCode: string;
  totalAmount: number;
}

export interface ICreateTransactionGroup {
  name: string;
  currencyCode: string;
  participants: string[];
}

export interface IUpdateTransactionGroup extends ICreateTransactionGroup {
  id: string;
}