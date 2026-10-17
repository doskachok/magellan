import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

reportWebVitals();
registerServiceWorker();
