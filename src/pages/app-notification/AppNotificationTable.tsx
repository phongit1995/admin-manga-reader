import {
  Table,
  TableBody,
  TableContainer,
  CircularProgress,
  TableHead,
  TableRow,
  TableCell,
  Box,
  Typography,
} from "@mui/material";
import { IAppNotificationModel } from "@src/types/app-notification.types";
import AppNotificationService from "@src/services/app-notification.service";
import { toast } from "react-toastify";
import AppNotificationTableRow from "./AppNotificationTableRow";

// Table components
interface AppNotificationTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const AppNotificationTableHead = ({ headLabel }: AppNotificationTableHeadProps) => (
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', width: 150 },
  { id: 'message', label: 'Message', width: 200 },
  { id: 'packageId', label: 'Package ID', width: 150 },
  { id: 'platform', label: 'Platform', width: 100 },
  { id: 'version', label: 'Version', width: 100 },
  { id: 'link', label: 'Link', width: 150 },
  { id: 'enable', label: 'Enable', align: 'center' as const, width: 80 },
  { id: 'isForce', label: 'Force Update', align: 'center' as const, width: 100 },
  { id: 'createdAt', label: 'Created At', width: 120 },
  { id: 'actions', label: '', width: 100 },
];

// ----------------------------------------------------------------------

interface AppNotificationTableProps {
  notificationList: IAppNotificationModel[];
  loading: boolean;
  onEdit: (notification: IAppNotificationModel) => void;
  onDelete: (notification: IAppNotificationModel) => void;
  onStatusChange: () => void;
}

export default function AppNotificationTable({ 
  notificationList, 
  loading,
  onEdit,
  onDelete,
  onStatusChange
}: AppNotificationTableProps) {
  const handleToggleStatus = async (id: string, field: 'enable' | 'isForce', value: boolean) => {
    try {
      if (!id) {
        toast.error('Notification ID not found');
        return;
      }
      
      // Chỉ gửi field cần update
      const updateData = {
        [field]: value
      };
      
      console.log(`Updating ${field} to ${value}`);
      
      await AppNotificationService.updateAppNotification(id, updateData);
      
      toast.success(`${field === 'enable' ? 'Enable' : 'Force update'} status updated successfully`);
      
      // Call onStatusChange to refresh the list
      onStatusChange();
    } catch (error) {
      console.error(`Error updating ${field} status:`, error);
      toast.error(`Failed to update ${field} status`);
      throw error; // Re-throw so the component can handle its own state
    }
  };
  
  return (
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
        <AppNotificationTableHead
          headLabel={TABLE_HEAD}
        />
        <TableBody>
          {notificationList.map((row) => (
            <AppNotificationTableRow
              key={row._id}
              row={row}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}

          {!notificationList.length && !loading && (
            <TableRow>
              <TableCell colSpan={10}>
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No App Notifications Found
                  </Typography>
                  <Typography variant="body2">
                    No app notifications available.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 