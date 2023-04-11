import { Route, Routes } from 'react-router-dom';
import { ExpenseRouteMode} from 'constants/routes';
import MainInfo from './MainInfo';

const AddExpense = () => {
  return (
    <Routes>
      <Route path={`${ExpenseRouteMode.ADD_MAININFO}`} element={<MainInfo/>} />
    </Routes>
  );
};

export default AddExpense;
