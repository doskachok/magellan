import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TriangleAlert } from 'lucide-react';

import { Button, EmptyState, PageSpinner } from 'components';
import { RedirectIfAuthenticated, RequireAuth } from 'features/auth/guards';
import { routePatterns, routes } from 'lib/routes';

const SignInPage = lazy(() => import('features/auth/SignInPage'));
const SignUpPage = lazy(() => import('features/auth/SignUpPage'));
const GroupsPage = lazy(() => import('features/groups/GroupsPage'));
const GroupDetailsPage = lazy(() => import('features/groups/GroupDetailsPage'));
const GroupSettingsPage = lazy(() => import('features/groups/GroupSettingsPage'));
const SettleDebtPage = lazy(() => import('features/groups/SettleDebtPage'));
const GroupStatisticsPage = lazy(() => import('features/groups/statistics/GroupStatisticsPage'));
const NewExpensePage = lazy(() => import('features/expenses/new/NewExpensePage'));
const ExpenseDetailsPage = lazy(() => import('features/expenses/ExpenseDetailsPage'));
const AccountPage = lazy(() => import('features/account/AccountPage'));

const RootLayout = () => (
  <Suspense fallback={<PageSpinner />}>
    <Outlet />
  </Suspense>
);

const RouteError = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  console.error(error);

  return (
    <EmptyState
      icon={<TriangleAlert size={28} />}
      title={t('errorTitle')}
      description={t('errorDescription')}
      action={<Button onClick={() => window.location.assign(routes.groups)}>{t('errorAction')}</Button>}
    />
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        children: [
          { path: routes.signIn, element: <SignInPage /> },
          { path: routes.signUp, element: <SignUpPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <Navigate to={routes.groups} replace /> },
          { path: routes.groups, element: <GroupsPage /> },
          { path: routes.newGroup, element: <GroupSettingsPage /> },
          { path: routePatterns.group, element: <GroupDetailsPage /> },
          { path: routePatterns.groupSettings, element: <GroupSettingsPage /> },
          { path: routePatterns.groupStatistics, element: <GroupStatisticsPage /> },
          { path: routePatterns.settleDebt, element: <SettleDebtPage /> },
          { path: routePatterns.expense, element: <ExpenseDetailsPage /> },
          { path: routePatterns.newExpense, element: <NewExpensePage /> },
          { path: routes.account, element: <AccountPage /> },
        ],
      },
      { path: '*', element: <Navigate to={routes.groups} replace /> },
    ],
  },
]);
