import {Route, Routes} from 'react-router-dom';
import {ROUTES} from 'constants/routes';
import MainInfo from './AddExpense/MainInfo';

const Expenses = () => {
  return (
    <Routes>
      <Route path={ROUTES.EXPENSES.ADD_MAININFO} element={<MainInfo/>} />
    </Routes>
  );
};

export default Expenses;
