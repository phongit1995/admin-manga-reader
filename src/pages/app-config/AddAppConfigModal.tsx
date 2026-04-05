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
import { ICreateAppConfigRequest } from '@src/types/app-config.types';
import AppConfigService from '@src/services/app-config.service';

const schema = yup.object({
  source: yup.string().required('Source is required'),
  showFakeApp: yup.boolean().default(false),
  imageResource: yup.string(),
  readImageHeader: yup.string().test('is-json', 'Must be a valid JSON object', value => {
    if (!value) return true; // Empty is valid, will convert to undefined later
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }),
  imageHeader: yup.string().test('is-json', 'Must be a valid JSON object', value => {
    if (!value) return true; // Empty is valid, will default to {}
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }),
}).required();

type FormValues = {
  source: string;
  showFakeApp: boolean;
  imageResource: string;
  readImageHeader: string;
  imageHeader: string;
}

interface AddAppConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAppConfigModal({ open, onClose, onSuccess }: AddAppConfigModalProps) {
  const [loading, setLoading] = useState(false);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      source: '',
      showFakeApp: false,
      imageResource: '',
      readImageHeader: '',
      imageHeader: '{}'
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open) {
      reset({
        source: '',
        showFakeApp: false,
        imageResource: '',
        readImageHeader: '',
        imageHeader: '{}'
      });
    }
  }, [open, reset]);

  const handleAddConfig = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Parse JSON strings to objects for API
      let readImageHeaderObj;
      let imageHeaderObj;
      
      try {
        if (data.readImageHeader) {
          readImageHeaderObj = JSON.parse(data.readImageHeader);
        }
      } catch (error) {
        toast.error('Invalid JSON in Read Image Header field');
        setLoading(false);
        return;
      }
      
      try {
        if (data.imageHeader) {
          imageHeaderObj = JSON.parse(data.imageHeader);
        } else {
          imageHeaderObj = {};
        }
      } catch (error) {
        toast.error('Invalid JSON in Image Header field');
        setLoading(false);
        return;
      }
      
      // Convert form data to match API request type
      const requestData: ICreateAppConfigRequest = {
        source: data.source,
        showFakeApp: data.showFakeApp,
        // Only include optional fields if they have values
        ...(data.imageResource ? { imageResource: data.imageResource } : {}),
        ...(readImageHeaderObj ? { readImageHeader: readImageHeaderObj } : {}),
        imageHeader: imageHeaderObj
      };
      
      const response = await AppConfigService.createAppConfig(requestData);
      
      if (response) {
        reset();
        onClose();
        onSuccess();
        toast.success('App Configuration added successfully');
      } else {
        toast.error('Failed to add app configuration');
      }
    } catch (error) {
      console.error('Error creating app configuration:', error);
      toast.error('Failed to add app configuration');
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
      maxWidth="md"
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Add New App Configuration</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Source"
                  error={!!errors.source}
                  helperText={errors.source?.message}
                  disabled={loading}
                  placeholder="config_source"
                  {...field}
                />
              )}
            />
            
            <Controller
              name="imageResource"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Image Resource"
                  error={!!errors.imageResource}
                  helperText={errors.imageResource?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="readImageHeader"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Read Image Header (JSON)"
                  error={!!errors.readImageHeader}
                  helperText={errors.readImageHeader?.message || "Enter valid JSON object or leave empty"}
                  disabled={loading}
                  multiline
                  rows={4}
                  placeholder="{}"
                  {...field}
                />
              )}
            />
            
            <Controller
              name="imageHeader"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Image Header (JSON)"
                  error={!!errors.imageHeader}
                  helperText={errors.imageHeader?.message || "Enter valid JSON object"}
                  disabled={loading}
                  multiline
                  rows={4}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="showFakeApp"
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
                  label="Show Fake App"
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
          onClick={handleSubmit(handleAddConfig)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 