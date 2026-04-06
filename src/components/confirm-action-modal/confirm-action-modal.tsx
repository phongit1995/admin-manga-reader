import { useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { IconifyName } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface ConfirmActionConfig {
  key: string;
  label: string;
  title: string;
  /** Text inserted into "Are you sure you want to {actionText} …" */
  actionText: string;
  color: 'error' | 'success' | 'primary' | 'info' | 'warning';
  icon: IconifyName;
  /** Optional extra warning shown below the main message */
  warning?: string;
}

interface ConfirmActionModalProps {
  open: boolean;
  action: ConfirmActionConfig | null;
  /** Number of selected items */
  numSelected: number;
  /** Singular entity name, e.g. "manga", "novel" */
  entityName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmActionModal({
  open,
  action,
  numSelected,
  entityName,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!action) return;

    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(`Error during ${action.key} action:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-action-dialog-title"
      aria-describedby="confirm-action-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[24],
        },
      }}
    >
      <DialogTitle id="confirm-action-dialog-title" sx={{ pb: 1 }}>
        {action?.title ?? 'Confirm Action'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-action-dialog-description">
          Are you sure you want to {action?.actionText ?? 'perform this action on'}{' '}
          <b>{numSelected}</b> selected {entityName}
          {numSelected > 1 ? 's' : ''}?
          {action?.warning && (
            <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>
              {action.warning}
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          autoFocus
          color={action?.color ?? 'primary'}
          disabled={loading}
          variant="contained"
          startIcon={action ? <Iconify icon={action.icon} /> : undefined}
        >
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
