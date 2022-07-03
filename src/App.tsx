import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { Provider } from 'react-redux';
import {ThemeProvider} from 'styled-components';

import theme from './constants/theme/default.theme';

import store from './store';

import {ROUTES} from './constants/routes';

import Auth from './features/auth';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.ROOT}>
              <Route index element={<Navigate to={ROUTES.AUTH.ROOT} />} />
              <Route path={`${ROUTES.AUTH.ROOT}/*`} element={<Auth/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
