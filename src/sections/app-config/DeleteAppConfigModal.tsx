import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Button, 
  CircularProgress,
  Typography,
  Stack
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IAppConfigModel } from '@src/types/app-config.types';
import AppConfigService from '@src/services/app-config.service';

interface DeleteAppConfigModalProps {
  open: boolean;
  onClose: () => void;
  config: IAppConfigModel | null;
  onSuccess: () => void;
}

export default function DeleteAppConfigModal({
  open,
  onClose,
  config,
  onSuccess,
}: DeleteAppConfigModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!config || !config._id) {
      toast.error('Config ID not found');
      return;
    }
    
    try {
      setLoading(true);
      
      await AppConfigService.deleteAppConfig(config._id);
      
      toast.success('App Configuration deleted successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting app configuration:', error);
      toast.error('Failed to delete app configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Delete App Configuration</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            Are you sure you want to delete this app configuration?
          </DialogContentText>
          
          {config && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                Source: <Typography component="span" variant="body2">{config.source || '-'}</Typography>
              </Typography>
              
              <Typography variant="subtitle2">
                Image Resource: <Typography component="span" variant="body2">{config.imageResource || '-'}</Typography>
              </Typography>
              
              <Typography variant="subtitle2">
                Show Fake App: <Typography component="span" variant="body2">{config.showFakeApp ? 'Yes' : 'No'}</Typography>
              </Typography>
            </Stack>
          )}
          
          <DialogContentText color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 