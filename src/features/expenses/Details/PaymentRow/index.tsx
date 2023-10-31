
import { getCurrencyWithSymbolString } from 'helpers/currencyHelper';
import { PaymentAmountText, UserNameText, PaymentRowContainer } from './index.styled';

export interface IPaymentRowProps {
  user: string,
  amount: number,
  currencyCode: string,
}

const PaymentRow = (props: IPaymentRowProps) => {
  return (
    <PaymentRowContainer>
      <UserNameText> {props.user} </UserNameText>
      <PaymentAmountText>
        {getCurrencyWithSymbolString(props.amount, props.currencyCode)}
      </PaymentAmountText>
    </PaymentRowContainer>
  );
};

export default PaymentRow;
