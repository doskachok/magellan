import { Route, Routes } from 'react-router';
import { CreateRouteString } from 'constants/routes';
import AddExpense from './AddExpense';
import ExpenseDetails from './Details';

const Expenses = () => {
  return (
    <Routes>
      <Route path={`${CreateRouteString}/*`} element={<AddExpense/>} />
      <Route path={':expenseId'} element={<ExpenseDetails/>} />
    </Routes>
  );
};

export default Expenses;
