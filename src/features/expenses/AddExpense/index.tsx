import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ExpenseRouteMode} from 'constants/routes';
import { saveTransaction } from '../slice';
import MainInfo from './MainInfo';
import AddPayers from './AddPayers';

const AddExpense = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(saveTransaction(null));
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path={`${ExpenseRouteMode.ADD_MAININFO}`} element={<MainInfo/>} />
      <Route path={`${ExpenseRouteMode.ADD_PAYERS}`} element={<AddPayers/>} />
    </Routes>
  );
};

export default AddExpense;
