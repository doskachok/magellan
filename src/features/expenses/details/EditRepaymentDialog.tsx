import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Button, Dialog, TextField } from 'components';
import { parseAmount, roundMoney, toDateInputValue } from 'lib/format';
import { isAmountInput } from '../new/draft';
import { useUpdateTransactionMutation } from '../api';
import { SplitMethod, type Transaction } from '../types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(2)};
`;

interface EditRepaymentDialogProps {
  open: boolean;
  groupId: string;
  repayment: Transaction;
  onClose: () => void;
}

/** A repayment keeps who paid whom; only its amount and date change. The API caps the amount at what's owed. */
export const EditRepaymentDialog = ({ open, groupId, repayment, onClose }: EditRepaymentDialogProps) => {
  const { t } = useTranslation('expenses');
  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();
  const current = repayment.payerDetails[0]?.amount ?? 0;
  const [amount, setAmount] = useState(() => roundMoney(current).toFixed(2));
  const [date, setDate] = useState(() => toDateInputValue(new Date(repayment.paymentDateUtc)));
  const [showErrors, setShowErrors] = useState(false);

  const value = parseAmount(amount);
  const amountError = value > 0 ? undefined : t('amountRequired');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (amountError || !date) {
      setShowErrors(true);
      return;
    }

    const payer = repayment.payerDetails[0];
    const receiver = repayment.partialsAssignments[0];
    const result = await updateTransaction({
      id: repayment.id,
      groupId,
      name: repayment.name,
      currencyCode: repayment.currencyCode,
      paymentDateUtc: new Date(`${date}T12:00:00`).toISOString(),
      payerDetails: [{ payerId: payer.payerId, amount: value }],
      partialsAssignments: [{ userId: receiver.userId, partialAmount: value, splitMethod: SplitMethod.AssignedAmount }],
    });
    if ('error' in result) return;

    toast.success(t('repaymentSaved'));
    onClose();
  };

  return (
    <Dialog open={open} title={t('editRepayment')} onClose={onClose}>
      <Form onSubmit={event => void handleSubmit(event)} noValidate>
        <TextField
          label={t('totalAmount', { currency: repayment.currencyCode })}
          inputMode="decimal"
          value={amount}
          onChange={event => isAmountInput(event.target.value) && setAmount(event.target.value)}
          error={showErrors ? amountError : undefined}
        />
        <TextField
          label={t('date')}
          type="date"
          value={date}
          onChange={event => setDate(event.target.value)}
          error={showErrors && !date ? t('dateRequired') : undefined}
        />
        <Actions>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button type="submit" loading={isLoading}>
            {t('save')}
          </Button>
        </Actions>
      </Form>
    </Dialog>
  );
};
