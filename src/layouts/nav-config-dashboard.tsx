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
    title: 'Category',
    path: ERouterConfig.CATEGORY,
    icon: <Icon icon="material-symbols:category-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:category" width={24} height={24} />,
  },
  {
    title: 'Config Source',
    path: ERouterConfig.CONFIG_SOURCE,
    icon: <Icon icon="material-symbols:settings-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:settings" width={24} height={24} />,
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
        icon: <Icon icon="eva:bell-fill" width={20} height={20} />,
        activeIcon: <Icon icon="eva:bell-fill" width={20} height={20} />,
      },
    ],
  },
  {
    title: 'User',
    path: ERouterConfig.USER,
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: ERouterConfig.PRODUCT,
    icon: icon('ic-cart'),
  },
  {
    title: 'Blog',
    path: ERouterConfig.BLOG,
    icon: icon('ic-blog'),
  },
  {
    title: 'Sign in',
    path: ERouterConfig.SIGN_IN,
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: ERouterConfig.PAGE_404,
    icon: icon('ic-disabled'),
  },
];
