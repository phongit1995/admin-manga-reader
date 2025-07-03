import {
  Table,
  TableBody,
  TableContainer,
  CircularProgress,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Typography,
  Switch,
  Card,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { INotificationSourceModel } from "@src/types/notification-source.type";
import { NotificationSourceService } from "src/services/notification-source.service";
import { useState } from "react";
import { toast } from "react-toastify";

// Table components
interface NotificationSourceTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const NotificationSourceTableHead = ({ headLabel }: NotificationSourceTableHeadProps) => (
  <TableHead>
    <TableRow>
      {headLabel.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align || 'left'}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

interface NotificationSourceTableRowProps {
  row: INotificationSourceModel;
  index: number;
  onDeleteClick: (notificationSource: INotificationSourceModel) => void;
  onStatusChange: (id: string, enabled: boolean) => Promise<void>;
}

const NotificationSourceTableRow = ({ row, index, onDeleteClick, onStatusChange }: NotificationSourceTableRowProps) => {
  const [updating, setUpdating] = useState(false);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUpdating(true);
      await onStatusChange(row._id, event.target.checked);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TableRow hover>
      <TableCell align="center">
        {index + 1}
      </TableCell>
      
      <TableCell>
        <Typography variant="subtitle2">{row.name || 'N/A'}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" noWrap sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.clientEmail || 'N/A'}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.projectId || 'N/A'}</Typography>
      </TableCell>
      
      <TableCell align="center">
        <Switch 
          checked={Boolean(row.enable)} 
          onChange={handleSwitchChange}
          disabled={updating}
        />
      </TableCell>
      
      <TableCell>
        {formatDate(row.createdAt)}
      </TableCell>
      
      <TableCell>
        {formatDate(row.updatedAt)}
      </TableCell>
      
      <TableCell align="right" sx={{ width: 60 }}>
        <IconButton onClick={() => onDeleteClick(row)} size="small">
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const TABLE_HEAD = [
  { id: 'no', label: 'NO', align: 'center' as const, width: 60 },
  { id: 'name', label: 'Name', width: 180 },
  { id: 'clientEmail', label: 'Client Email', width: 250 },
  { id: 'projectId', label: 'Project ID', width: 220 },
  { id: 'enable', label: 'Enable', align: 'center' as const, width: 100 },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: '', label: '', width: 60 },
];

interface NotificationSourceTableProps {
  notificationSourceList: INotificationSourceModel[];
  loading: boolean;
  onDeleteClick: (notificationSource: INotificationSourceModel) => void;
  onRefresh: () => void;
}

export default function NotificationSourceTable({ 
  notificationSourceList, 
  loading, 
  onDeleteClick,
  onRefresh
}: NotificationSourceTableProps) {
  // Ensure notificationSourceList is always an array
  const safeList = Array.isArray(notificationSourceList) ? notificationSourceList : [];
  
  const handleStatusChange = async (id: string, enabled: boolean) => {
    try {
      await NotificationSourceService.updateNotificationSource(id, {
        enable: enabled
      });
      
      toast.success(`Notification source ${enabled ? 'enabled' : 'disabled'} successfully`);
      onRefresh();
    } catch (error) {
      console.error('Error updating notification source status:', error);
      toast.error('Failed to update notification source status');
    }
  };
  
  return (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 200 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <Table sx={{ minWidth: 800 }}>
          <NotificationSourceTableHead
            headLabel={TABLE_HEAD}
          />
          <TableBody>
            {safeList.map((row, index) => (
              <NotificationSourceTableRow
                key={row._id}
                row={row}
                index={index}
                onDeleteClick={onDeleteClick}
                onStatusChange={handleStatusChange}
              />
            ))}

            {!safeList.length && !loading && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No Notification Sources Found
                    </Typography>
                    <Typography variant="body2">
                      No notification sources available.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
