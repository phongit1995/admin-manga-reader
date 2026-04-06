import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AdminAuthService } from '@src/services';
import { ERouterConfig } from '@src/config/router.config';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = AdminAuthService.isAuthenticated();

  useEffect(() => {
    console.log('ProtectedRoute check:', { isAuthenticated, path: location.pathname });
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to={ERouterConfig.SIGN_IN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

