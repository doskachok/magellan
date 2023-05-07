import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Column } from 'components/Containers';
import { ICreateTransaction, IPartialAssignments } from 'features/expenses/types';
import { ITransactionGroup } from 'features/groups/types';
import UserListItem from 'components/UserListItem';
import { Input, SmallInput } from 'components';
import { updateOrAddPartialAssigment } from 'features/expenses/slice';

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

const validInput = new RegExp(
  '^\\d+(\\.\\d{1,2})?\\.?$'
);

const SAVE_DELAY_MS = 300;

const UserAmountComponent = (partialsAssignments: IPartialAssignments) => {
  const dispatch = useDispatch();
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const [amount, setAmount] = useState<string>('0');

  const onInputTextChanged = useCallback((_name: string, value: string) => {
    value = value.replace(',', '.');
    if (!validInput.test(value) && value !== '') return;

    if (!value.endsWith('.')) // remove leading zeros
      value = (+value).toString();

    setAmount(value);
  }, [setAmount]);

  useEffect(() => {
    if (amount.endsWith('.') || +amount === partialsAssignments.partialAmount)
      return;

    if (saveTimer.current)
      clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => dispatch(updateOrAddPartialAssigment({
      ...partialsAssignments,
      partialAmount: +amount,
    })), SAVE_DELAY_MS);
  }, [dispatch, amount, partialsAssignments]);

  return (
    <Input
      reversedTheme
      autoFocus
      name="amount"
      type="text"
      inputMode="decimal"
      value={amount}
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