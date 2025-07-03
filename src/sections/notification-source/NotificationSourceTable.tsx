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
  onDeleteClick: (notificationSource: INotificationSourceModel) => void;
}

const NotificationSourceTableRow = ({ row, onDeleteClick }: NotificationSourceTableRowProps) => (
  <TableRow hover>
    <TableCell>
      <Typography variant="subtitle2">{row.name}</Typography>
    </TableCell>
    
    <TableCell>
      <Typography variant="body2" noWrap sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {row.clientEmail}
      </Typography>
    </TableCell>
    
    <TableCell>
      <Typography variant="body2">{row.projectId}</Typography>
    </TableCell>
    
    <TableCell align="center">
      <Switch checked={row.enable} disabled />
    </TableCell>
    
    <TableCell>
      {new Date(row.createdAt).toLocaleDateString()}
    </TableCell>
    
    <TableCell>
      {new Date(row.updatedAt).toLocaleDateString()}
    </TableCell>
    
    <TableCell align="right">
      <IconButton onClick={() => onDeleteClick(row)}>
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
      </IconButton>
    </TableCell>
  </TableRow>
);

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'clientEmail', label: 'Client Email', width: 250 },
  { id: 'projectId', label: 'Project ID', width: 180 },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

interface NotificationSourceTableProps {
  notificationSourceList: INotificationSourceModel[];
  loading: boolean;
  onDeleteClick: (notificationSource: INotificationSourceModel) => void;
}

export default function NotificationSourceTable({ 
  notificationSourceList, 
  loading, 
  onDeleteClick 
}: NotificationSourceTableProps) {
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
            {notificationSourceList.map((row) => (
              <NotificationSourceTableRow
                key={row._id}
                row={row}
                onDeleteClick={onDeleteClick}
              />
            ))}

            {!notificationSourceList.length && !loading && (
              <TableRow>
                <TableCell colSpan={7}>
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
