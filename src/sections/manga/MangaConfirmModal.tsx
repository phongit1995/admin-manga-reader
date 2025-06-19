import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export type ActionType = 'disable' | 'enable' | 'resetImages';

interface MangaConfirmModalProps {
  open: boolean;
  action: ActionType | null;
  numSelected: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function MangaConfirmModal({
  open,
  action,
  numSelected,
  onClose,
  onConfirm
}: MangaConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const getActionText = () => {
    switch (action) {
      case 'disable':
        return 'disable';
      case 'enable':
        return 'enable';
      case 'resetImages':
        return 'reset images for';
      default:
        return '';
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case 'disable':
        return "Disable Selected Manga";
      case 'enable':
        return "Enable Selected Manga";
      case 'resetImages':
        return "Reset Images for Selected Manga";
      default:
        return "Confirm Action";
    }
  };

  const handleConfirm = async () => {
    if (!action) return;
    
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[24]
        } 
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
        {getActionTitle()}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to {getActionText()} <b>{numSelected}</b> selected manga{numSelected > 1 ? 's' : ''}?
          {action === 'resetImages' && <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>This will trigger a new crawl process to update all images.</Typography>}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          autoFocus 
          color={action === 'disable' ? 'error' : action === 'enable' ? 'success' : 'primary'} 
          disabled={loading}
          variant="contained"
          startIcon={action === 'disable' ? <Iconify icon="solar:eye-closed-bold" /> : 
                   action === 'enable' ? <Iconify icon="solar:eye-bold" /> : 
                   <Iconify icon="solar:restart-bold" />}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
