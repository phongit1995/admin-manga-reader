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
