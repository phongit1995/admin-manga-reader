import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { IUserModel } from 'src/types';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

type UserTableRowProps = {
  row: IUserModel;
  selected: boolean;
  onSelectRow: () => void;
  onChangeCoin: () => void;
  onChangePassword: () => void;
};

export function UserTableRow({ 
  row, 
  selected, 
  onSelectRow, 
  onChangeCoin, 
  onChangePassword 
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeCoin = useCallback(() => {
    handleClosePopover();
    onChangeCoin();
  }, [onChangeCoin, handleClosePopover]);

  const handleChangePassword = useCallback(() => {
    handleClosePopover();
    onChangePassword();
  }, [onChangePassword, handleClosePopover]);

  const getGenderLabel = (gender: number) => {
    switch(gender) {
      case 0:
        return 'Female';
      case 1:
        return 'Male';
      case 2:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const getGenderColor = (gender: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch(gender) {
      case 0:
        return 'error';
      case 1:
        return 'info';
      case 2:
        return 'default';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => dayjs(dateString).format('DD/MM/YYYY');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={row.avatar} alt={row.username} sx={{ width: 40, height: 40 }}>
              {row.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" noWrap>
              {row.username}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.email}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Chip 
            label={getGenderLabel(row.gender)} 
            size="small"
            color={getGenderColor(row.gender)}
            variant="outlined"
          />
        </TableCell>

        <TableCell align="center">
          <Chip 
            label={row.coin} 
            size="small"
            color="primary"
            variant="outlined"
          />
        </TableCell>
        
        <TableCell align="center">
          <Label color={row.isVip ? 'warning' : 'default'}>
            {row.isVip ? 'VIP' : 'Free'}
          </Label>
        </TableCell>

        <TableCell align="center">
          {row.isVip ? (
            <Typography variant="body2" color="warning.main">
              {formatDate(row.vipTime)}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              N/A
            </Typography>
          )}
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">
            {formatDate(row.createdAt)}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 180,
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
          <MenuItem onClick={handleChangeCoin}>
            <Iconify icon="solar:cart-3-bold" />
            Change Coins
          </MenuItem>

          <MenuItem onClick={handleChangePassword}>
            <Iconify icon="solar:pen-bold" />
            Change Password
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
