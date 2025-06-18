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
import { IConfigSourceModel } from '@src/types/config-source.type';
import { ConfigSourceService } from '@services/config-source.service';
import { Iconify } from "src/components/iconify";

interface DeleteConfigSourceModalProps {
  open: boolean;
  onClose: () => void;
  configSource: IConfigSourceModel | null;
  onSuccess: () => void; 
}

export default function DeleteConfigSourceModal({
  open,
  onClose,
  configSource,
  onSuccess
}: DeleteConfigSourceModalProps) {
  const [loading, setLoading] = useState(false);

  if (!configSource) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const response = await ConfigSourceService.deleteConfigSource(configSource._id);
      
      if (response) {
        onClose();
        onSuccess();
        toast.success('Config Source deleted successfully');
      } else {
        toast.error(response?.message || 'Failed to delete config source');
      }
    } catch (error) {
      console.error('Error deleting config source:', error);
      toast.error('Failed to delete config source');
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
        Delete Config Source
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete:
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="error.main"
            sx={{ mt: 2 }}
          >
            {configSource.name}
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Key: {configSource.key}
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