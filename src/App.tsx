import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router';
import { Suspense } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
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

const PrivateRoutes = () => {
  const token = useSelector(tokenSelector);
  return token ? <Outlet /> : <Navigate to={ROUTES.AUTH.ROOT} />;
};

const Loader = () => (<p>Loading...</p>);

// styled-components v6 forwards every prop to the DOM; keep the v5 behaviour of dropping non-HTML props
// for plain elements (custom components still receive all props).
const shouldForwardProp = (propName: string, target: unknown) =>
  typeof target === 'string' ? isPropValid(propName) : true;

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <StyleSheetManager shouldForwardProp={shouldForwardProp}>
            <ThemeProvider theme={theme}>
              <ModalProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path={ROUTES.ROOT} element={<PrivateRoutes />}>
                      <Route index element={<Navigate to={ROUTES.GROUPS.ROOT} />} />
                      <Route path={`${ROUTES.GROUPS.ROOT}/*`} element={<Groups />} />
                      <Route path={`${ROUTES.ACCOUNT_SETTINGS}/*`} element={<AccountSettings />} />
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
          </StyleSheetManager>
        </PersistGate>
      </Provider>
    </Suspense>
  );
}

export default App;
