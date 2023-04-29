import { ICreateTransaction } from "features/expenses/types";
import { ITransactionGroup } from "features/groups/types";

interface IProps {
  transaction: ICreateTransaction;
  group: ITransactionGroup;
}

// TODO
const EquallySplitMethodView = ({ transaction, group }: IProps) => {
  return (
    <div>
      <h3>EquallySplitMethodView</h3>
    </div>
  );
};

export default EquallySplitMethodView;