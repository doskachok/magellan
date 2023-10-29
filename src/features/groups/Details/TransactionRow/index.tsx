import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Column } from 'components/Containers';
import { RowWrapperLink } from 'components/Link';
import { ExpenseRouteMode, composeExpenseRoute } from 'constants/routes';
import { ITransaction } from 'features/groups/types';
import { getCurrencyWithSymbolString } from 'helpers/currencyHelper';
import { TransactionAmountText, TransactionNameText, TransactionRowContainer, YourPartAmount, YourPartAmountHint } from './index.styled';

export interface ITransactionRowProps {
  transaction: ITransaction,
}

const TransactionRow = ({ transaction }: ITransactionRowProps) => {
  const { t } = useTranslation('groups');
  const { groupId } = useParams();

  const transactionAttendanceHint = (amount: number): string => {
    if (amount > 0) return t('transactionYouLent'); 
    if (amount < 0) return t('transactionYouBorrowed');
    return t('transactionNotInvolved');
  }

  return (
    <RowWrapperLink to={composeExpenseRoute(groupId ?? "", transaction.id, ExpenseRouteMode.NONE)}>
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
    </RowWrapperLink>
  );
};

export default TransactionRow;
