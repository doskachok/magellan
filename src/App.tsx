import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

import {ROUTES} from './constants/routes';

import Auth from './features/auth';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.ROOT}>
            <Route index element={<div>test</div>} />
            <Route path={`${ROUTES.AUTH.ROOT}/*`} element={<Auth/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
