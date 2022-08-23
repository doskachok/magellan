import { Route, Routes } from 'react-router-dom';
import { Notification } from '../../components/Notification';
import { ROUTES } from '../../constants/routes';

import Login from './login';
import Register from './register';

const Auth = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
    </Routes>
  );
};

export default Auth;
