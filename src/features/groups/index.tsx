import {Route, Routes} from 'react-router-dom';
import {ROUTES, GroupRouteMode} from '../../constants/routes';
import GroupsList from './Catalog';
import GroupEdit from './Edit';
import GroupDetails from './Details';
import Expenses from 'features/expenses';

const Groups = () => {
  return (
    <Routes>
      <Route index element={<GroupsList/>} />
      <Route path={`:groupId/${GroupRouteMode.EDIT}`} element={<GroupEdit/>} />
      <Route path={`:groupId/${GroupRouteMode.EXPENSES}/*`} element={<Expenses/>} />
      <Route path={':groupId'} element={<GroupDetails/>} />
      <Route path={ROUTES.GROUPS.CREATE} element={<GroupEdit/>} />
    </Routes>
  );
};

export default Groups;
