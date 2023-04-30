import { Column } from "components/Containers";
import UserListItem from "components/UserListItem";
import { ICreateTransaction } from "features/expenses/types";
import { ITransactionGroup } from "features/groups/types";
import { getCurrencyWithSymbolString } from "helpers/currencyHelper";

import { CurrencyText } from "./Equally.styled";

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

const EquallySplitMethodView = ({ transaction, group }: IProps) => {
  const totalAmount = transaction.payerDetails.reduce((acc, curr) => acc + curr.amount, 0);
  const amountPerUser = totalAmount / transaction.partialsAssignments.length;

  return (
    <Column fullWidth gap={'0.5rem'}>
      {transaction.partialsAssignments.map(u => <UserListItem
        key={u.userId}
        user={group.participants.find(p => p.id === u.userId)!}
        rightItem={<CurrencyText>{getCurrencyWithSymbolString(amountPerUser, transaction.currencyCode)}</CurrencyText>}
      />)}
    </Column>
  );
};

export default EquallySplitMethodView;