import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

interface UserChangeCoinModalProps {
  open: boolean;
  user: {
    _id: string;
    username: string;
    coin: number;
  } | null;
  onClose: () => void;
  onConfirm: (userId: string, newCoin: number) => Promise<void>;
}

export function UserChangeCoinModal({
  open,
  user,
  onClose,
  onConfirm
}: UserChangeCoinModalProps) {
  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState<number>(0);

  const handleOpen = () => {
    if (user) {
      setCoinValue(user.coin);
    }
  };

  const handleConfirm = async () => {
    if (!user) return;
    
    if (coinValue < 0) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(user._id, coinValue);
      onClose();
    } catch (error) {
      console.error('Error updating coin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnter={handleOpen}
      maxWidth="xs"
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[24]
        } 
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Change User Coins
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Update coin balance for <strong>{user?.username}</strong>
        </Typography>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
          Current balance: <strong>{user?.coin || 0}</strong> coins
        </Typography>
        <TextField
          autoFocus
          fullWidth
          type="number"
          label="New Coin Balance"
          value={coinValue}
          onChange={(e) => setCoinValue(Number(e.target.value))}
          disabled={loading}
          inputProps={{ min: 0 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="primary" 
          disabled={loading}
          variant="contained"
          startIcon={<Iconify icon="solar:cart-3-bold" />}
        >
          {loading ? 'Updating...' : 'Update Coins'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

