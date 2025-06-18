import { Icon } from '@iconify/react';

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
    path: '/manga',
    icon: <Icon icon="material-symbols:menu-book-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:menu-book" width={24} height={24} />,
  },
  {
    title: 'Category',
    path: '/category',
    icon: <Icon icon="material-symbols:category-outline" width={24} height={24} />,
    activeIcon: <Icon icon="material-symbols:category" width={24} height={24} />,
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
