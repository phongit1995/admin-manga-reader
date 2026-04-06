import { useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  /** Primary display name of the item being deleted */
  itemName?: string;
  /** Optional extra info lines shown below itemName */
  extraInfo?: { label: string; value: string }[];
  /** Static message shown instead of itemName + extraInfo */
  message?: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  itemName,
  extraInfo,
  message,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error during delete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = (_event: unknown, reason: string) => {
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
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>{title}</DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          {message ? (
            <Typography variant="body1">{message}</Typography>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete:
              </Typography>
              {itemName && (
                <Typography variant="h6" fontWeight="bold" color="error.main" sx={{ mt: 2 }}>
                  {itemName}
                </Typography>
              )}
              {extraInfo?.map((info) => (
                <Typography key={info.label} variant="body2" sx={{ mt: 0.5 }}>
                  {info.label}: {info.value}
                </Typography>
              ))}
            </>
          )}
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
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Iconify icon="solar:trash-bin-trash-bold" />
            )
          }
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
