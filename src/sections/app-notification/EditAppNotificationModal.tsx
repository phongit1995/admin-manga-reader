import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { IAppNotificationModel } from '@src/types/app-notification.types';
import AppNotificationService from '@src/services/app-notification.service';

const schema = yup.object({
  message: yup.string(),
  version: yup.string(),
  link: yup.string().url('Must be a valid URL').required('Link is required'),
  isForce: yup.boolean().default(false),
  enable: yup.boolean().default(true)
}).required();

type FormValues = {
  packageId: string;
  platform: string;
  message: string;
  version: string;
  link: string;
  isForce: boolean;
  enable: boolean;
}

interface EditAppNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  notification: IAppNotificationModel | null;
}

export default function EditAppNotificationModal({ 
  open, 
  onClose, 
  onSuccess, 
  notification 
}: EditAppNotificationModalProps) {
  const [loading, setLoading] = useState(false);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      packageId: '',
      platform: 'android',
      message: '',
      version: '',
      link: '',
      isForce: false,
      enable: true
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open && notification) {
      reset({
        packageId: notification.packageId || '',
        platform: notification.platform || 'android',
        message: notification.message || '',
        version: notification.version || '',
        link: notification.link || '',
        isForce: !!notification.isForce,
        enable: notification.enable !== undefined ? !!notification.enable : true
      });
    }
  }, [open, notification, reset]);

  const handleUpdateNotification = async (data: FormValues) => {
    try {
      if (!notification?._id) {
        toast.error('Notification ID not found');
        return;
      }
      
      setLoading(true);
      
      // Convert form data to match API request type
      const requestData = {
        message: data.message,
        link: data.link,
        isForce: data.isForce,
        enable: data.enable,
        // Only include version if it has value
        ...(data.version ? { version: data.version } : {})
      };
      
      const response = await AppNotificationService.updateAppNotification(notification._id, requestData);
      
      if (response) {
        onClose();
        onSuccess();
        toast.success('App Notification updated successfully');
      } else {
        toast.error('Failed to update app notification');
      }
    } catch (error) {
      console.error('Error updating app notification:', error);
      toast.error('Failed to update app notification');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  const handleDialogClose = (event: any, reason: string) => {
    if (reason !== 'backdropClick' || !loading) {
      handleClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose} 
      fullWidth 
      maxWidth="sm"
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Edit App Notification</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="packageId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Package ID"
                  error={!!errors.packageId}
                  helperText={errors.packageId?.message}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Platform"
                  error={!!errors.platform}
                  helperText={errors.platform?.message}
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  {...field}
                >
                  <MenuItem value="android">Android</MenuItem>
                  <MenuItem value="ios">iOS</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Message"
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Version"
                  error={!!errors.version}
                  helperText={errors.version?.message}
                  disabled={loading}
                  placeholder="1.0.0"
                  {...field}
                />
              )}
            />
            
            <Controller
              name="link"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Link"
                  error={!!errors.link}
                  helperText={errors.link?.message}
                  disabled={loading}
                  placeholder="https://example.com"
                  {...field}
                />
              )}
            />
            
            <Controller
              name="isForce"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Force Update"
                />
              )}
            />
            
            <Controller
              name="enable"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label="Enable"
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit(handleUpdateNotification)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 