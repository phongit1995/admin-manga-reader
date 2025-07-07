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
import { ICreateAppNotificationRequest } from '@src/types/app-notification.types';
import AppNotificationService from '@src/services/app-notification.service';

const schema = yup.object({
  packageId: yup.string().required('Package ID is required'),
  platform: yup.string().required('Platform is required'),
  title: yup.string(),
  message: yup.string(),
  version: yup.string(),
  link: yup.string().url('Must be a valid URL').required('Link is required'),
  isForce: yup.boolean().default(false),
}).required();

type FormValues = {
  packageId: string;
  platform: string;
  title: string;
  message: string;
  version: string;
  link: string;
  isForce: boolean;
}

interface AddAppNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAppNotificationModal({ open, onClose, onSuccess }: AddAppNotificationModalProps) {
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
      title: '',
      message: '',
      version: '',
      link: '',
      isForce: false
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open) {
      reset({
        packageId: '',
        platform: 'android',
        title: '',
        message: '',
        version: '',
        link: '',
        isForce: false
      });
    }
  }, [open, reset]);

  const handleAddNotification = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Convert form data to match API request type
      const requestData: ICreateAppNotificationRequest = {
        packageId: data.packageId,
        platform: data.platform,
        link: data.link,
        isForce: data.isForce,
        // Only include optional fields if they have values
        ...(data.title ? { title: data.title } : {}),
        ...(data.message ? { message: data.message } : {}),
        ...(data.version ? { version: data.version } : {})
      };
      
      const response = await AppNotificationService.createAppNotification(requestData);
      
      if (response) {
        reset();
        onClose();
        onSuccess();
        toast.success('App Notification added successfully');
      } else {
        toast.error('Failed to add app notification');
      }
    } catch (error) {
      console.error('Error creating app notification:', error);
      toast.error('Failed to add app notification');
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
      <DialogTitle>Add New App Notification</DialogTitle>
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
                  disabled={loading}
                  placeholder="com.example.app"
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
                  disabled={loading}
                  {...field}
                >
                  <MenuItem value="android">Android</MenuItem>
                  <MenuItem value="ios">iOS</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={loading}
                  {...field}
                />
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
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit(handleAddNotification)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 