import {Route, Routes} from 'react-router-dom';
import {ROUTES} from 'constants/routes';
import MainInfo from './AddExpense/mainInfo';

const Expenses = () => {
  return (
    <Routes>
      <Route path={ROUTES.EXPENSES.ADD_MAININFO} element={<MainInfo/>} />
    </Routes>
  );
};

export default Expenses;
