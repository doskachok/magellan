import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

import {ROUTES} from './constants/routes';

import Login from './features/auth/login';
import Register from './features/auth/register';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.ROOT}>
            <Route index element={<div>test</div>} />
            <Route path={ROUTES.AUTH.ROOT}>
              <Route index element={<Login/>} />
              <Route path={ROUTES.AUTH.REGISTER} element={<Register/>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
