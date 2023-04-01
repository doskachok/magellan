import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

import theme from './constants/theme/default.theme';

import store, { persistor } from './store';

import { ROUTES } from './constants/routes';

import ErrorNotifier from './store/errorNotifier';

import Auth from './features/auth';
import Groups from './features/groups';
import { tokenSelector } from './features/auth/slice';
import ModalProvider from './providers/ModalProvider';
import AccountSettings from 'features/userProfile/accountSettings';
import Expenses from 'features/expenses';

const PrivateRoutes = () => {
  const token = useSelector(tokenSelector);
  return token ? <Outlet /> : <Navigate to={ROUTES.AUTH.ROOT} />;
};

const Loader = () => (<p>Loading...</p>);

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={theme}>
            <ModalProvider>
              <BrowserRouter>
                <Routes>
                  <Route path={ROUTES.ROOT} element={<PrivateRoutes />}>
                    <Route index element={<Navigate to={ROUTES.GROUPS.ROOT} />} />
                    <Route path={`${ROUTES.GROUPS.ROOT}/*`} element={<Groups />} />
                    <Route path={`${ROUTES.ACCOUNT_SETTINGS}/*`} element={<AccountSettings />} />
                    <Route path={`${ROUTES.EXPENSES.ROOT}/*`} element={<Expenses />} />
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
        </PersistGate>
      </Provider>
    </Suspense>
  );
}

export default App;
