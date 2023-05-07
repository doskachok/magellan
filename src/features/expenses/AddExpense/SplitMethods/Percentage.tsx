import { ICreateTransaction } from 'features/expenses/types';
import { ITransactionGroup } from 'features/groups/types';

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

// TODO
const PercentageSplitMethodView = ({ transaction, group }: IProps) => {
  return (
    <div>
      <h3>PercentageSplitMethodView</h3>
    </div>
  );
};

export default PercentageSplitMethodView;