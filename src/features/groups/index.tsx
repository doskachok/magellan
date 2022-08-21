import {Route, Routes} from 'react-router-dom';
import {ROUTES} from '../../constants/routes';
import GroupsList from './List';

const Groups = () => {
  return (
    <Routes>
      <Route index element={<GroupsList/>} />
      <Route path={ROUTES.GROUPS.LIST} element={<GroupsList/>} />
    </Routes>
  );
};

export default Groups;
