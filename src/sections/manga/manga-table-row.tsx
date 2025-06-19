import { useState, useCallback } from 'react';
import dayjs from 'dayjs';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { IMangaModel } from 'src/types';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type MangaTableRowProps = {
  row: IMangaModel;
  selected: boolean;
  onSelectRow: () => void;
};

export function MangaTableRow({ row, selected, onSelectRow }: MangaTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // Map status code to readable status
  const getStatus = (statusCode: number) => {
    switch(statusCode) {
      case 0:
        return 'Ongoing';
      case 1:
        return 'Completed';
      case 2:
        return 'Dropped';
      default:
        return 'Unknown';
    }
  };

  const statusColor = row.status === 1 ? 'success' : row.status === 0 ? 'warning' : 'error';
  
  // Format date using dayjs
  const formatDate = (dateString: string) => dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row" sx={{ maxWidth: 280 }}>
          <Typography variant="subtitle2" noWrap>{row.name}</Typography>
        </TableCell>

        <TableCell sx={{ maxWidth: 120 }}>
          <Typography variant="body2" noWrap>
            {row.genres.slice(0, 2).join(', ')}
            {row.genres.length > 2 && '...'}
          </Typography>
        </TableCell>

        <TableCell align="center">{row.totalChapters}</TableCell>

        <TableCell align="center">{row.views.toLocaleString()}</TableCell>
        
        <TableCell align="center">{formatDate(row.chapterUpdate)}</TableCell>

        <TableCell>
          <Label color={statusColor}>{getStatus(row.status)}</Label>
        </TableCell>
        
        <TableCell>
          <Typography variant="body2">{row.source}</Typography>
        </TableCell>
        
        <TableCell align="center">
          <Label color={row.enable ? 'success' : 'error'}>
            {row.enable ? 'Yes' : 'No'}
          </Label>
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
            width: 140,
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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
} 