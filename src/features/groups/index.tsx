import {Route, Routes} from 'react-router-dom';
import {ROUTES} from '../../constants/routes';
import GroupsList from './Catalog';
import GroupEdit from './Edit';
import GroupDetails from './Details';

const Groups = () => {
  return (
    <Routes>
      <Route index element={<GroupsList/>} />
      <Route path={ROUTES.GROUPS.LIST} element={<GroupsList/>} />
      <Route path={`${ROUTES.GROUPS.EDIT}/:groupId`} element={<GroupEdit/>} />
      <Route path={ROUTES.GROUPS.CREATE} element={<GroupEdit/>} />
      <Route path={`${ROUTES.GROUPS.GROUP}/:groupId`} element={<GroupDetails/>} />
    </Routes>
  );
};

export default Groups;
