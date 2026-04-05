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
import Badge from '@mui/material/Badge';

import { IUserModel } from 'src/types';

import { Iconify } from 'src/components/iconify';

type UserTableRowProps = {
  row: IUserModel;
  selected: boolean;
  onSelectRow: () => void;
  onChangeCoin: () => void;
  onChangePassword: () => void;
  onViewDetail: () => void;
};

export function UserTableRow({ 
  row, 
  selected, 
  onSelectRow, 
  onChangeCoin, 
  onChangePassword,
  onViewDetail,
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

  const handleViewDetail = useCallback(() => {
    handleClosePopover();
    onViewDetail();
  }, [onViewDetail, handleClosePopover]);

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

  // Check VIP: isVip flag OR vipTime is in the future
  const isVipActive = row.isVip || (row.vipTime && new Date(row.vipTime) > new Date());

  const formatDateTime = (dateString: string) => dayjs(dateString).format('DD/MM/YYYY HH:mm');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isVipActive ? (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: '#FFB300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #fff',
                      fontSize: 10,
                    }}
                  >
                    👑
                  </Box>
                ) : null
              }
            >
              <Avatar
                src={row.avatar}
                alt={row.username}
                sx={{
                  width: 40,
                  height: 40,
                  ...(isVipActive && {
                    border: '2px solid #FFB300',
                    boxShadow: '0 0 8px rgba(255, 179, 0, 0.4)',
                  }),
                }}
              >
                {row.username.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {row.username}
              </Typography>
              {isVipActive && (
                <Typography variant="caption" sx={{ color: '#FFB300', fontWeight: 'bold' }}>
                  VIP {row.vipTime ? `• đến ${dayjs(row.vipTime).format('DD/MM/YYYY')}` : ''}
                </Typography>
              )}
            </Box>
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
          <Typography variant="body2">
            {formatDateTime(row.createdAt)}
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
          <MenuItem onClick={handleViewDetail}>
            <Iconify icon="solar:eye-bold" />
            View Detail
          </MenuItem>

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
