import {Route, Routes} from 'react-router-dom';
import {ROUTES} from '../../constants/routes';

import Login from './Login';
import Register from './Register';

const Auth = () => {
  return (
    <Routes>
      <Route index element={<Login/>} />
      <Route path={ROUTES.AUTH.REGISTER} element={<Register/>} />
    </Routes>
  );
};

export default Auth;
