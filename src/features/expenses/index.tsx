import { Route, Routes } from 'react-router-dom';
import { CreateRouteString } from 'constants/routes';
import AddExpense from './AddExpense';

const Expenses = () => {
  return (
    <Routes>
      <Route path={`${CreateRouteString}/*`} element={<AddExpense/>} />
    </Routes>
  );
};

export default Expenses;
