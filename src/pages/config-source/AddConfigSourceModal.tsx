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
  Switch,
  FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICreateConfigSourceRequest } from '@src/types/config-source.type';
import { ConfigSourceService } from "@services/config-source.service";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

// Define validation schema
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

interface AddConfigSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh the config source list
}

export default function AddConfigSourceModal({ open, onClose, onSuccess }: AddConfigSourceModalProps) {
  const [loading, setLoading] = useState(false);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<ICreateConfigSourceRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      key: '',
      index: 0,
      enable: true
    },
    mode: 'onChange' // Validate on change for better UX
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        key: '',
        index: 0,
        enable: true
      });
    }
  }, [open, reset]);

  const handleAddConfigSource = async (data: ICreateConfigSourceRequest) => {
    try {
      setLoading(true);
      const configSourceData = {
        ...data,
        index: Number(data.index)
      };

      const response = await ConfigSourceService.createConfigSource(configSourceData);
      if (response && response.data) {
        reset();
        onClose(); 
        onSuccess(); 
        toast.success('Config Source added successfully');
      } else {
        toast.error(response?.message || 'Failed to add config source');
      }
    } catch (error) {
      console.error('Error creating config source:', error);
      toast.error('Failed to add config source');
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

  // Only close if not loading
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
      <DialogTitle>Add New Config Source</DialogTitle>
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
          onClick={handleSubmit(handleAddConfigSource)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 