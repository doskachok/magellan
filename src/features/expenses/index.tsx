import {Route, Routes} from 'react-router-dom';
import {CreateRouteString, ExpenseRouteMode} from 'constants/routes';
import MainInfo from './AddExpense/MainInfo';

const Expenses = () => {
  return (
    <Routes>
      <Route path={`${CreateRouteString}/${ExpenseRouteMode.ADD_MAININFO}`} element={<MainInfo/>} />
    </Routes>
  );
};

export default Expenses;
