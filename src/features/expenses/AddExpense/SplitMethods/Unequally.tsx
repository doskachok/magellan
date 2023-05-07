import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Column } from "components/Containers";
import { ICreateTransaction, IPartialAssignments } from "features/expenses/types";
import { ITransactionGroup } from "features/groups/types";
import UserListItem from "components/UserListItem";
import { Input, SmallInput } from "components";
import { updateOrAddPartialAssigment } from "features/expenses/slice";

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

const validInput = new RegExp(
  '^\\d+(\\.\\d{1,2})?\\.?$'
);

const UserAmountComponent = (partialsAssignments: IPartialAssignments) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState<IPartialAssignments>(partialsAssignments);

  const onInputTextChanged = useCallback((_name: string, value: string) => {
    value = value.replace(',', '.');
    if (!validInput.test(value) && value !== '') return;

    setForm((form) => ({
      ...form,
      partialAmount: +value,
    }));
  }, [setForm]);

  useEffect(() => {
    dispatch(updateOrAddPartialAssigment(form));
  }, [dispatch, form]);

  return (
    <Input
      reversedTheme
      autoFocus
      name="amount"
      type="text"
      inputMode="decimal"
      value={form.partialAmount.toString() || '0'}
      onTextChange={onInputTextChanged}
      autoComplete="off"
      ComponentInput={SmallInput}
    />
  );
};

const UnequallySplitMethodView = ({ transaction, group }: IProps) => {
  return (
    <Column fullWidth gap={'0.5rem'}>
      {transaction.partialsAssignments.map(u => <UserListItem
        key={u.userId}
        user={group.participants.find(p => p.id === u.userId)!}
        rightItem={UserAmountComponent(transaction.partialsAssignments.find(p => p.userId === u.userId)!)}
      />)}
    </Column>
  );
};

export default UnequallySplitMethodView;