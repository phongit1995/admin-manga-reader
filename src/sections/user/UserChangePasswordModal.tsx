import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

interface UserChangePasswordModalProps {
  open: boolean;
  user: {
    _id: string;
    username: string;
  } | null;
  onClose: () => void;
  onConfirm: (userId: string, newPassword: string) => Promise<void>;
}

export function UserChangePasswordModal({
  open,
  user,
  onClose,
  onConfirm
}: UserChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!user || !password || password.length < 6) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(user._id, password);
      handleClose();
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Change User Password
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Set new password for <strong>{user?.username}</strong>
        </Typography>
        <TextField
          autoFocus
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Enter new password (min 6 characters)"
          helperText="Password must be at least 6 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowPassword(!showPassword)} 
                  edge="end"
                  disabled={loading}
                >
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="warning" 
          disabled={loading || !password || password.length < 6}
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

