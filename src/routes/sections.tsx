import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ERouterConfig } from 'src/config/router.config';
import { ProtectedRoute } from 'src/routes/components';

// ----------------------------------------------------------------------

export const DashboardPage        = lazy(() => import('src/pages/dashboard'));
export const UserPage             = lazy(() => import('src/pages/user'));
export const MangaPage            = lazy(() => import('src/pages/manga'));
export const MangaDetailPage      = lazy(() => import('src/pages/manga/detail'));
export const NovelPage            = lazy(() => import('src/pages/novel'));
export const CategoryPage         = lazy(() => import('src/pages/category'));
export const AppConfigPage        = lazy(() => import('src/pages/app-config'));
export const ConfigSourcePage     = lazy(() => import('src/pages/config-source'));
export const InAppPurchasePage    = lazy(() => import('src/pages/in-app-purchase'));
export const NotificationSourcePage = lazy(() => import('src/pages/notification-source'));
export const AppNotificationPage  = lazy(() => import('src/pages/app-notification'));
export const PlatformConfigPage   = lazy(() => import('src/pages/platform-config'));
export const SendNotificationPage = lazy(() => import('src/pages/send-notification'));
export const RedeemCodePage       = lazy(() => import('src/pages/redeem-code'));
export const CommentMangaPage     = lazy(() => import('src/pages/comment-manga'));
export const AnalyticsConfigPage  = lazy(() => import('src/pages/analytics-config'));
export const SignInPage           = lazy(() => import('src/pages/sign-in'));
export const Page404              = lazy(() => import('src/pages/not-found'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ERouterConfig.USER, element: <UserPage /> },
      { path: ERouterConfig.MANGA, element: <MangaPage /> },
      { path: ERouterConfig.MANGA_DETAIL, element: <MangaDetailPage /> },
      { path: ERouterConfig.NOVEL, element: <NovelPage /> },
      { path: ERouterConfig.CATEGORY, element: <CategoryPage /> },
      { path: ERouterConfig.CONFIG_SOURCE, element: <ConfigSourcePage /> },
      { path: ERouterConfig.APP_CONFIG, element: <AppConfigPage /> },
      { path: ERouterConfig.IN_APP_PURCHASE, element: <InAppPurchasePage /> },
      { path: ERouterConfig.NOTIFICATION_SOURCE, element: <NotificationSourcePage /> },
      { path: ERouterConfig.APP_NOTIFICATION, element: <AppNotificationPage /> },
      { path: ERouterConfig.PLATFORM_CONFIG, element: <PlatformConfigPage /> },
      { path: ERouterConfig.SEND_NOTIFICATION, element: <SendNotificationPage /> },
      { path: ERouterConfig.REDEEM_CODE, element: <RedeemCodePage /> },
      { path: ERouterConfig.COMMENT_MANGA, element: <CommentMangaPage /> },
      { path: ERouterConfig.ANALYTICS_CONFIG, element: <AnalyticsConfigPage /> },
    ],
  },
  {
    path: ERouterConfig.SIGN_IN,
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: ERouterConfig.PAGE_404,
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
