import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

import theme from './constants/theme/default.theme';

import store from './store';

import { ROUTES } from './constants/routes';

import ErrorNotifier from './store/errorNotifier';

import Auth from './features/auth';
import Groups from './features/groups';
import { tokenSelector } from './features/auth/slice';
import ModalProvider from './providers/ModalProvider';

const PrivateRoutes = () => {
  const token = useSelector(tokenSelector);
  return token ? <Outlet /> : <Navigate to={ROUTES.AUTH.ROOT} />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.ROOT} element={<PrivateRoutes />}>
                <Route index element={<Navigate to={ROUTES.GROUPS.ROOT} />} />
                <Route path={`${ROUTES.GROUPS.ROOT}/*`} element={<Groups />} />
              </Route>
              <Route path={`${ROUTES.AUTH.ROOT}/*`} element={<Auth />} />
            </Routes>
            <ErrorNotifier />
          </BrowserRouter>
          <Toaster
            position='bottom-center'
            toastOptions={{
              duration: 3000,
            }}
          />
        </ModalProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
