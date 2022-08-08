import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { Provider } from 'react-redux';
import {ThemeProvider} from 'styled-components';
import {SnackbarProvider} from 'notistack';

import theme from './constants/theme/default.theme';

import store from './store';

import {ROUTES} from './constants/routes';

import ErrorNotifier from './store/errorNotifier';

import Auth from './features/auth';
import Groups from './features/groups';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.ROOT}>
                <Route index element={<Navigate to={ROUTES.AUTH.ROOT} />} />
                <Route path={`${ROUTES.AUTH.ROOT}/*`} element={<Auth/>}/>
                <Route path={`${ROUTES.GROUPS.ROOT}/*`} element={<Groups/>}/>
              </Route>
            </Routes>
            <ErrorNotifier/>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
