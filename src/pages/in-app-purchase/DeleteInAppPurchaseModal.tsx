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
import { IInAppPurchaseModel } from '@src/types/in-app-purchase.type';
import { InAppPurchaseService } from '@src/services/in-app-purchase.service';
import { Iconify } from "src/components/iconify";

interface DeleteInAppPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  purchase: IInAppPurchaseModel | null;
  onSuccess: () => void; 
}

export default function DeleteInAppPurchaseModal({
  open,
  onClose,
  purchase,
  onSuccess
}: DeleteInAppPurchaseModalProps) {
  const [loading, setLoading] = useState(false);

  if (!purchase) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const response = await InAppPurchaseService.deleteInAppPurchase(purchase._id);
      
      if (response) {
        onClose();
        onSuccess();
        toast.success('In-App Purchase deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete In-App Purchase');
      }
    } catch (error) {
      console.error('Error deleting In-App Purchase:', error);
      toast.error('Failed to delete In-App Purchase');
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
        Delete In-App Purchase
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this in-app purchase:
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="error.main"
            sx={{ mt: 2 }}
          >
            {purchase.productId}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mt: 1 }}
          >
            Transaction ID: {purchase.transactionId}
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