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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { IConfigSourceModel, IUpdateConfigSourceRequest } from '@src/types/config-source.type';
import { ConfigSourceService } from "@services/config-source.service";

const schema = yup.object({
  name: yup.string().required('Name is required'),
  key: yup.string().required('Key is required'),
  index: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .typeError('Index must be a number')
    .required('Index is required')
    .min(0, 'Index must be a positive number'),
  enable: yup.boolean().default(true)
}).required();

type FormValues = {
  name: string;
  key: string;
  index: number;
  enable: boolean;
}

interface EditConfigSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  configSource: IConfigSourceModel | null;
}

export default function EditConfigSourceModal({ 
  open, 
  onClose, 
  onSuccess, 
  configSource 
}: EditConfigSourceModalProps) {
  const [loading, setLoading] = useState(false);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      key: '',
      index: 0,
      enable: true
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open && configSource) {
      reset({
        name: configSource.name || '',
        key: configSource.key || '',
        index: configSource.index || 0,
        enable: configSource.enable !== undefined ? !!configSource.enable : true
      });
    }
  }, [open, configSource, reset]);

  const handleUpdateConfigSource = async (data: FormValues) => {
    try {
      if (!configSource?._id) {
        toast.error('Config Source ID not found');
        return;
      }
      
      setLoading(true);
      
      const requestData: IUpdateConfigSourceRequest = {
        name: data.name,
        key: data.key,
        index: Number(data.index),
        enable: data.enable
      };
      
      const response = await ConfigSourceService.updateConfigSource(configSource._id, requestData);
      
      if (response) {
        onClose();
        onSuccess();
        toast.success('Config Source updated successfully');
      } else {
        toast.error('Failed to update config source');
      }
    } catch (error) {
      console.error('Error updating config source:', error);
      toast.error('Failed to update config source');
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
      <DialogTitle>Edit Config Source</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="key"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Key"
                  error={!!errors.key}
                  helperText={errors.key?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="index"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Index"
                  type="number"
                  error={!!errors.index}
                  helperText={errors.index?.message}
                  InputProps={{ inputProps: { min: 0 } }}
                  disabled={loading}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    field.onChange(value);
                  }}
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
          onClick={handleSubmit(handleUpdateConfigSource)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 