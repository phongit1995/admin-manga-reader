import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { INovelModel } from 'src/types';
import { ERouterConfig } from 'src/config/router.config';

import { ActionPopover } from '@components/action-popover';
import { Label } from 'src/components/label';

type NovelTableRowProps = {
  row: INovelModel;
  selected: boolean;
  onSelectRow: () => void;
};

export function NovelTableRow({ row, selected, onSelectRow }: NovelTableRowProps) {
  const navigate = useNavigate();

  const handleViewDetail = useCallback(() => {
    const detailPath = ERouterConfig.NOVEL_DETAIL.replace(':id', row._id);
    navigate(detailPath);
  }, [navigate, row._id]);

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

  const formatDate = (dateString: string) => dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');

  return (
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
          <ActionPopover
            actions={[
              { label: 'View', icon: 'solar:eye-bold', onClick: handleViewDetail },
              { label: 'Edit', icon: 'solar:pen-bold', onClick: () => {} },
              { label: 'Delete', icon: 'solar:trash-bin-trash-bold', onClick: () => {}, color: 'error.main' },
            ]}
          />
        </TableCell>
      </TableRow>
  );
}

