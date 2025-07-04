import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { IAppNotificationModel } from '@src/types/app-notification.types';
import AppNotificationService from '@src/services/app-notification.service';
import { Iconify } from "src/components/iconify";

interface DeleteAppNotificationModalProps {
  open: boolean;
  onClose: () => void;
  notification: IAppNotificationModel | null;
  onSuccess: () => void; 
}

export default function DeleteAppNotificationModal({
  open,
  onClose,
  notification,
  onSuccess
}: DeleteAppNotificationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!notification) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const response = await AppNotificationService.deleteAppNotification(notification._id || '');
      
      if (response) {
        onClose();
        onSuccess();
        toast.success('App Notification deleted successfully');
      } else {
        toast.error('Failed to delete App Notification');
      }
    } catch (error) {
      console.error('Error deleting App Notification:', error);
      toast.error('Failed to delete App Notification');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close only if not loading
  const handleDialogClose = (event: any, reason: string) => {
    if (reason !== 'backdropClick' || !loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown={loading}
      PaperProps={{
        elevation: 24,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        Delete App Notification
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this notification:
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="error.main"
            sx={{ mt: 2 }}
          >
            {notification.message || 'Notification'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mt: 1 }}
          >
            Package ID: {notification.packageId}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mt: 0.5 }}
          >
            Platform: {notification.platform}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        <Button 
          variant="outlined"
          onClick={onClose} 
          disabled={loading}
          sx={{ minWidth: 120 }}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          sx={{ minWidth: 120 }}
          startIcon={loading ? 
            <CircularProgress size={16} color="inherit" /> : 
            <Iconify icon="solar:trash-bin-trash-bold" />
          }
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 