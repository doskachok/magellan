import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CreateRouteString, ExpenseRouteMode, NoneRouteString, composeExpenseRoute} from 'constants/routes';
import { newTransactionSelector, saveTransaction } from '../slice';
import MainInfo from './MainInfo';
import AddPayers from './AddPayers';
import AddParticipants from './AddParticipants';

const ConnectedRoutes = () => {
  const transaction = useSelector(newTransactionSelector);
  if (transaction) return <Outlet />;
  return <Navigate to={composeExpenseRoute(NoneRouteString, CreateRouteString, ExpenseRouteMode.ADD_MAININFO)} />;
};

const AddExpense = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(saveTransaction(null));
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path={`${ExpenseRouteMode.ADD_MAININFO}`} element={<MainInfo />} />
      <Route path={'*'} element={<ConnectedRoutes />}>
        <Route path={`${ExpenseRouteMode.ADD_PAYERS}`} element={<AddPayers />} />
        <Route path={`${ExpenseRouteMode.ADD_PARTICIPANTS}`} element={<AddParticipants />} />
      </Route>
    </Routes>
  );
};

export default AddExpense;
