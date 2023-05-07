import { ICreateTransaction } from "features/expenses/types";
import { ITransactionGroup } from "features/groups/types";

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

// TODO
const AdjustmentSplitMethodView = ({ transaction, group }: IProps) => {
  return (
    <div>
      <h3>AdjustmentSplitMethodView</h3>
    </div>
  );
};

export default AdjustmentSplitMethodView;