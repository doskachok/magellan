import { Navigate, Outlet, useLocation } from 'react-router';

import { useAppSelector } from 'store';
import { selectToken } from 'store/authSlice';
import { routes } from 'lib/routes';

export const RequireAuth = () => {
  const token = useAppSelector(selectToken);
  const location = useLocation();

  return token ? <Outlet /> : <Navigate to={routes.signIn} replace state={{ from: location.pathname + location.search }} />;
};

export const RedirectIfAuthenticated = () => {
  const token = useAppSelector(selectToken);
  return token ? <Navigate to={routes.groups} replace /> : <Outlet />;
};
