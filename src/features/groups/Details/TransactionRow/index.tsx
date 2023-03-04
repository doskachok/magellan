import { ITransaction } from 'features/groups/types';
import { getCurrencyWithSymbolString } from 'helpers/currencyHelper';
import { TransactionAmountText, TransactionNameText, TransactionRowContainer, YourPartText } from './index.styled';


export interface ITransactionRowProps {
  transaction: ITransaction,
}

const TransactionRow = ({ transaction }: ITransactionRowProps) => {
  return (
    <TransactionRowContainer>
      <TransactionAmountText>
         {getCurrencyWithSymbolString(transaction.totalAmount, transaction.currencyCode)}
      </TransactionAmountText>
      <TransactionNameText> {transaction.name} </TransactionNameText>
      <YourPartText amount={transaction.yourPart}>
        {getCurrencyWithSymbolString(Math.abs(transaction.yourPart), transaction.currencyCode)}
      </YourPartText>
    </TransactionRowContainer>
  );
};

export default TransactionRow;
