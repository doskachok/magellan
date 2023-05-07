import { ICreateTransaction } from "features/expenses/types";
import { ITransactionGroup } from "features/groups/types";

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

// TODO
const UnequallySplitMethodView = ({ transaction, group }: IProps) => {
  return (
    <div>
      <h3>UnequallySplitMethodView</h3>
    </div>
  );
};

export default UnequallySplitMethodView;