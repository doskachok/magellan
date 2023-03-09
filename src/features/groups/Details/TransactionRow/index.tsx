import { Column } from 'components/Containers';
import { ITransaction } from 'features/groups/types';
import { getCurrencyWithSymbolString } from 'helpers/currencyHelper';
import { useTranslation } from 'react-i18next';
import { TransactionAmountText, TransactionNameText, TransactionRowContainer, YourPartAmount, YourPartAmountHint } from './index.styled';

export interface ITransactionRowProps {
  transaction: ITransaction,
}

const TransactionRow = ({ transaction }: ITransactionRowProps) => {
  const { t } = useTranslation('groups');

  const transactionAttendanceHint = (amount: number): string => {
    if (amount > 0) return t('transactionYouLent'); 
    if (amount < 0) return t('transactionYouBorrowed');
    return t('transactionNotInvolved');
  }

  return (
    <TransactionRowContainer>
      <Column>
        <TransactionNameText> {transaction.name} </TransactionNameText>
        <TransactionAmountText>
          {getCurrencyWithSymbolString(transaction.totalAmount, transaction.currencyCode)}
        </TransactionAmountText>
      </Column>
      <Column>
        <YourPartAmountHint amount={transaction.yourPart}>
          {transactionAttendanceHint(transaction.yourPart)}
        </YourPartAmountHint>
        <YourPartAmount amount={transaction.yourPart}>
          {getCurrencyWithSymbolString(Math.abs(transaction.yourPart), transaction.currencyCode)}
        </YourPartAmount>
      </Column>
    </TransactionRowContainer>
  );
};

export default TransactionRow;
