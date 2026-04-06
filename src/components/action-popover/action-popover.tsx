import { useState, useCallback } from 'react';

import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';

import { Iconify } from 'src/components/iconify';

import type { IconifyName } from 'src/components/iconify';

export type ActionMenuItem = {
  label: string;
  icon: IconifyName;
  onClick: () => void;
  color?: string;
};

interface ActionPopoverProps {
  actions: ActionMenuItem[];
  width?: number;
}

export function ActionPopover({ actions, width = 140 }: ActionPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={() => {
                action.onClick();
                handleClose();
              }}
              sx={action.color ? { color: action.color } : undefined}
            >
              <Iconify icon={action.icon} />
              {action.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
