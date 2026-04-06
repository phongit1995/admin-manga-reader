import { useState, useEffect, useRef } from 'react';

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
  Typography,
  Input,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { AnalyticsService } from '@src/services/analytics.service';

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    propertyId: yup.string().required('Property ID is required'),
  })
  .required();

interface IFormInput {
  name: string;
  propertyId: string;
}

interface AddAnalyticsConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAnalyticsConfigModal({
  open,
  onClose,
  onSuccess,
}: AddAnalyticsConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', propertyId: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      reset({ name: '', propertyId: '' });
      setSelectedFile(null);
    }
  }, [open, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast.error('Please select a valid JSON file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmitForm = async (data: IFormInput) => {
    try {
      if (!selectedFile) {
        toast.error('Please select a Google service account JSON file');
        return;
      }

      setLoading(true);
      await AnalyticsService.createConfig({
        name: data.name,
        propertyId: data.propertyId,
        file: selectedFile,
      });

      toast.success('Analytics config added successfully');
      reset();
      setSelectedFile(null);
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating analytics config:', error);
      toast.error('Failed to add analytics config');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_e, reason) => {
        if (reason !== 'backdropClick' || !loading) handleClose();
      }}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>Add Analytics Config</DialogTitle>

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
                  placeholder="e.g. Manga App GA4"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="propertyId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="GA4 Property ID"
                  placeholder="e.g. 123456789"
                  error={!!errors.propertyId}
                  helperText={errors.propertyId?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Google Service Account Key
              </Typography>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '1px dashed',
                  borderColor: 'grey.400',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.neutral',
                  '&:hover': { bgcolor: 'background.paper', borderColor: 'primary.main' },
                  transition: 'all 0.2s',
                }}
              >
                <Input
                  inputRef={fileInputRef}
                  type="file"
                  sx={{ display: 'none' }}
                  onChange={handleFileChange}
                  inputProps={{ accept: 'application/json' }}
                />
                <Stack spacing={1} alignItems="center">
                  <Icon
                    icon="material-symbols:cloud-upload-outline"
                    width={40}
                    color={selectedFile ? undefined : 'gray'}
                  />
                  {selectedFile ? (
                    <Box>
                      <Typography variant="body2" color="primary.main" fontWeight="bold">
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Click to upload service account JSON file
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Upload a valid Google Analytics service account key (.json)
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleSubmitForm)}
          disabled={loading || !selectedFile}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
