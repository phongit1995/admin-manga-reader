import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { toast } from "react-toastify";
import { NotificationSourceService } from 'src/services/notification-source.service';
import { INotificationSourceModel } from '@src/types/notification-source.type';

interface DeleteNotificationSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  notificationSource: INotificationSourceModel | null;
}

export default function DeleteNotificationSourceModal({ 
  open, 
  onClose, 
  onSuccess,
  notificationSource 
}: DeleteNotificationSourceModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!notificationSource) return;
    
    try {
      setLoading(true);
      await NotificationSourceService.deleteNotificationSource(notificationSource._id);
      toast.success('Notification Source deleted successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting notification source:', error);
      toast.error('Failed to delete notification source');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleDialogClose = (event: any, reason: string) => {
    if (reason !== 'backdropClick' || !loading) {
      handleClose();
    }
  };

  if (!notificationSource) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Delete Notification Source</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete the notification source &quot;{notificationSource.name}&quot;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 