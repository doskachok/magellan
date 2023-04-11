import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ExpenseRouteMode} from 'constants/routes';
import MainInfo from './MainInfo';
import { saveTransaction } from '../slice';

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
    </Routes>
  );
};

export default AddExpense;
