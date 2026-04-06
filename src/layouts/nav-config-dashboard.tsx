import { Icon } from '@iconify/react';

import { ERouterConfig } from 'src/config/router.config';

// ----------------------------------------------------------------------

const icon = (name: string, size = 24) => <Icon icon={name} width={size} height={size} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  children?: NavItem[];
};

export const navData: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('solar:home-angle-bold-duotone'),
  },
  {
    title: 'Manga',
    path: ERouterConfig.MANGA,
    icon: icon('material-symbols:menu-book-outline'),
  },
  {
    title: 'Novel',
    path: ERouterConfig.NOVEL,
    icon: icon('material-symbols:book-outline'),
  },
  {
    title: 'Category',
    path: ERouterConfig.CATEGORY,
    icon: icon('material-symbols:category-outline'),
  },
  {
    title: 'InApp Purchase',
    path: ERouterConfig.IN_APP_PURCHASE,
    icon: icon('material-symbols:payments-outline'),
  },
  {
    title: 'Notification',
    path: '#',
    icon: icon('eva:bell-outline'),
    children: [
      {
        title: 'Notification Source',
        path: ERouterConfig.NOTIFICATION_SOURCE,
        icon: icon('eva:email-outline', 20),
      },
      {
        title: 'App Notification',
        path: ERouterConfig.APP_NOTIFICATION,
        icon: icon('material-symbols:notifications-active-outline', 20),
      },
      {
        title: 'Send Notification',
        path: ERouterConfig.SEND_NOTIFICATION,
        icon: icon('material-symbols:send-outline', 20),
      },
    ],
  },
  {
    title: 'Config',
    path: '#',
    icon: icon('material-symbols:settings-outline'),
    children: [
      {
        title: 'Config Source',
        path: ERouterConfig.CONFIG_SOURCE,
        icon: icon('material-symbols:settings-input-component-outline', 20),
      },
      {
        title: 'App Config',
        path: ERouterConfig.APP_CONFIG,
        icon: icon('material-symbols:settings-applications-outline', 20),
      },
      {
        title: 'Platform Config',
        path: ERouterConfig.PLATFORM_CONFIG,
        icon: icon('material-symbols:devices-outline', 20),
      },
      {
        title: 'Redeem Code',
        path: ERouterConfig.REDEEM_CODE,
        icon: icon('material-symbols:redeem-outline', 20),
      },
    ],
  },
  {
    title: 'User',
    path: ERouterConfig.USER,
    icon: icon('solar:shield-keyhole-bold-duotone'),
  },
];
