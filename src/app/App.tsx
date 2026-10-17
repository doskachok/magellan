import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

import { PageSpinner } from 'components';
import { store } from 'store';
import { GlobalStyle } from 'theme/GlobalStyle';
import { theme } from 'theme/theme';
import { router } from './router';

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* Translations load over HTTP; i18next suspends until they arrive. */}
      <Suspense fallback={<PageSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: theme.font.family, borderRadius: theme.radius.md },
          success: { iconTheme: { primary: theme.colors.positive, secondary: '#fff' } },
          error: { iconTheme: { primary: theme.colors.negative, secondary: '#fff' } },
        }}
      />
    </ThemeProvider>
  </Provider>
);

export default App;
