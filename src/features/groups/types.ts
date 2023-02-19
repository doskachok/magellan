export interface ITransactionGroupListItem {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string;
  yourPart: number;
}

export interface ITransactionGroup {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string;
  participants: ITransactionGroupMember[];
  ownerId: string;
  transactions: ITransaction[];
}

export interface ITransaction {
  id: string;
  name: string;
  paymentDateUtc: Date;
  currencyCode: string;
  totalAmount: number;
}

export interface ITransactionGroupMember {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarId: string;
}

export interface ICreateTransactionGroup {
  name: string;
  currencyCode: string;
  avatarId?: string;
}

export interface IUpdateTransactionGroup extends ICreateTransactionGroup {
  id: string;
}
