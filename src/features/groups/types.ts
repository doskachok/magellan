export interface ITransactionGroup {
  id: string;
  name: string;
  currencyCode: string;
  avatarId?: string;
  participants: ITransactionGroupMember[];
  ownerId: string;
  transactions: ITransaction[];
}

export interface ITransactionGroupListItem extends Omit<ITransactionGroup, 'participants' | 'ownerId' | 'transactions'> {
  yourPart: number;
}

export interface ITransaction {
  id: string;
  name: string;
  paymentDateUtc: Date;
  currencyCode: string;
  totalAmount: number;
  yourPart: number;
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
