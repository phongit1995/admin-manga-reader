import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { Icon } from '@iconify/react';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';

import type { NavItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  slots,
  open,
  onClose,
}: NavContentProps & { open: boolean; onClose: VoidFunction }) {
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          invisible: true,
          onClick: onClose,
        },
      }}
      sx={{
        zIndex: 'var(--layout-nav-zIndex)',
        [`& .${drawerClasses.paper}`]: {
          left: 0,
          top: 0,
          width: 280,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows[24],
        },
      }}
    >
      <NavContent data={data} slots={slots} sx={{ p: 2.5 }} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Initialize expanded state for parent items marked as expanded
  // and close all other items when navigating
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    
    // Close all items by default when path changes
    // Only keep open the parent of the active item
    data.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => child.path === pathname);
        if (isChildActive) {
          initialOpenState[item.title] = true;
        } else {
          initialOpenState[item.title] = false;
        }
      }
    });
    
    setOpenItems(initialOpenState);
  }, [data, pathname]);

  const handleToggleItem = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderNavItem = (item: NavItem) => {
    const isParent = !!item.children && item.children.length > 0;
    const isOpen = openItems[item.title] || false;
    const isActive = !isParent && item.path === pathname;
    const isParentActive = isParent && item.children?.some(child => child.path === pathname);

    if (isParent) {
      return (
        <ListItem disableGutters disablePadding key={item.title} sx={{ display: 'block', flexDirection: 'column' }}>
          <ListItemButton
            disableGutters
            onClick={() => handleToggleItem(item.title)}
            sx={[
              (theme) => ({
                pl: 2,
                py: 1,
                gap: 2,
                pr: 1.5,
                width: '100%',
                borderRadius: 0.75,
                typography: 'body2',
                fontWeight: 'fontWeightMedium',
                color: theme.vars.palette.text.secondary,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                ...(isParentActive && {
                  fontWeight: 'fontWeightSemiBold',
                  color: theme.vars.palette.primary.main,
                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                  '&:hover': {
                    bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                  },
                }),
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }),
            ]}
          >
            <Box component="span" sx={{ width: 24, height: 24 }}>
              {isParentActive && item.activeIcon ? item.activeIcon : item.icon}
            </Box>
            
            <Box component="span" sx={{ flexGrow: 1 }}>
              {item.title}
            </Box>

            <Icon 
              icon={isOpen ? "eva:chevron-down-fill" : "eva:chevron-right-fill"} 
              width={18} 
              height={18} 
            />
          </ListItemButton>
          
          <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
            <List component="div" disablePadding sx={{ 
              pl: 0,
              mt: 0.5,
              mb: 0.5,
              width: '100%',
              '& .MuiListItemButton-root': {
                pl: 5,
                pr: 1.5,
                gap: 2,
                width: '100%',
                position: 'relative',
                '&::before': {
                  display: 'none',
                },
              },
            }}>
              {item.children?.map((child) => {
                const isChildActive = child.path === pathname;
                
                return (
                  <ListItemButton
                    key={child.title}
                    disableGutters
                    component={RouterLink}
                    href={child.path}
                    className={isChildActive ? 'active' : ''}
                    sx={[
                      (theme) => ({
                        py: 0.75,
                        height: 40,
                        borderRadius: 1,
                        typography: 'body2',
                        color: theme.vars.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        ...(isChildActive && {
                          color: theme.vars.palette.primary.main,
                          fontWeight: 'fontWeightSemiBold',
                          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                          '&:hover': {
                            bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                          },
                        }),
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        },
                      }),
                    ]}
                  >
                    <Box component="span" sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isChildActive && child.activeIcon ? child.activeIcon : child.icon}
                    </Box>
                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {child.title}
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </ListItem>
      );
    }

    return (
      <ListItem disableGutters disablePadding key={item.title}>
        <ListItemButton
          disableGutters
          component={RouterLink}
          href={item.path}
          sx={[
            (theme) => ({
              pl: 2,
              py: 1,
              gap: 2,
              pr: 1.5,
              borderRadius: 0.75,
              typography: 'body2',
              fontWeight: 'fontWeightMedium',
              color: theme.vars.palette.text.secondary,
              minHeight: 44,
              ...(isActive && {
                fontWeight: 'fontWeightSemiBold',
                color: theme.vars.palette.primary.main,
                bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                '&:hover': {
                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
                },
              }),
            }),
          ]}
        >
          <Box component="span" sx={{ width: 24, height: 24 }}>
            {isActive && item.activeIcon ? item.activeIcon : item.icon}
          </Box>

          <Box component="span" sx={{ flexGrow: 1 }}>
            {item.title}
          </Box>

          {item.info && item.info}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <>
      <Logo />

      {slots?.topArea}
      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => renderNavItem(item))}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <NavUpgrade />
    </>
  );
}
