import { Icon } from '@iconify/react';

import { ERouterConfig } from 'src/config/router.config'; 

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  activeIcon?: React.ReactNode;
  children?: NavItem[];
  expanded?: boolean;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Manga',
    path: ERouterConfig.MANGA,
    icon: <Icon icon="material-symbols:menu-book-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:menu-book" width={24} height={24} />,
  },
  {
    title: 'Novel',
    path: ERouterConfig.NOVEL,
    icon: <Icon icon="material-symbols:book-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:book" width={24} height={24} />,
  },
  {
    title: 'Category',
    path: ERouterConfig.CATEGORY,
    icon: <Icon icon="material-symbols:category-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:category" width={24} height={24} />,
  },
  {
    title: 'InApp Purchase',
    path: ERouterConfig.IN_APP_PURCHASE,
    icon: <Icon icon="material-symbols:payments-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:payments" width={24} height={24} />,
  },
  {
    title: 'Notification',
    path: '#', // Placeholder path
    icon: <Icon icon="eva:bell-outline" width={24} height={24} />,
    activeIcon: <Icon icon="eva:bell-fill" width={24} height={24} />,
    children: [
      {
        title: 'Notification Source',
        path: ERouterConfig.NOTIFICATION_SOURCE,
        icon: <Icon icon="eva:email-outline" width={20} height={20} />,
        activeIcon: <Icon icon="eva:email-fill" width={20} height={20} />,
      },
      {
        title: 'App Notification',
        path: ERouterConfig.APP_NOTIFICATION,
        icon: <Icon icon="material-symbols:notifications-active-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:notifications-active" width={20} height={20} />,
      },
      {
        title: 'Send Notification',
        path: ERouterConfig.SEND_NOTIFICATION,
        icon: <Icon icon="material-symbols:send-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:send" width={20} height={20} />,
      },
    ],
  },
  {
    title: 'Config',
    path: '#', // Placeholder path
    icon: <Icon icon="material-symbols:settings-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:settings" width={24} height={24} />,
    children: [
      {
        title: 'Config Source',
        path: ERouterConfig.CONFIG_SOURCE,
        icon: <Icon icon="material-symbols:settings-input-component-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:settings-input-component" width={20} height={20} />,
      },
      {
        title: 'App Config',
        path: ERouterConfig.APP_CONFIG,
        icon: <Icon icon="material-symbols:settings-applications-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:settings-applications" width={20} height={20} />,
      },
      {
        title: 'Platform Config',
        path: ERouterConfig.PLATFORM_CONFIG,
        icon: <Icon icon="material-symbols:devices-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:devices" width={20} height={20} />,
      },
      {
        title: 'Redeem Code',
        path: ERouterConfig.REDEEM_CODE,
        icon: <Icon icon="material-symbols:redeem-outline" width={20} height={20} />,
        activeIcon: <Icon icon="material-symbols:redeem" width={20} height={20} />,
      },
    ],
  },
  {
    title: 'User',
    path: ERouterConfig.USER,
    icon: icon('ic-user'),
  },
];
