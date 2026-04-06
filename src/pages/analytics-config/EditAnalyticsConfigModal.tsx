import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { AnalyticsService } from '@src/services/analytics.service';

import type { IAnalyticsConfigModel } from '@src/types/analytics.type';

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    propertyId: yup.string().required('Property ID is required'),
    index: yup.mixed<number>().transform((value) => (value === '' || value === null || isNaN(value) ? undefined : Number(value))),
  })
  .required();

interface IFormInput {
  name: string;
  propertyId: string;
  index?: number;
}

interface EditAnalyticsConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  config: IAnalyticsConfigModel | null;
}

export default function EditAnalyticsConfigModal({
  open,
  onClose,
  onSuccess,
  config,
}: EditAnalyticsConfigModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema) as any,
    defaultValues: { name: '', propertyId: '', index: undefined },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open && config) {
      reset({
        name: config.name,
        propertyId: config.propertyId,
        index: config.index ?? undefined,
      });
    }
  }, [open, config, reset]);

  const handleSubmitForm = async (data: IFormInput) => {
    if (!config) return;

    try {
      setLoading(true);
      await AnalyticsService.updateConfig(config._id, {
        name: data.name,
        propertyId: data.propertyId,
        index: data.index,
        enable: config.enable,
      });

      toast.success('Analytics config updated successfully');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error updating analytics config:', error);
      toast.error('Failed to update analytics config');
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
      <DialogTitle>Edit Analytics Config</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
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
            name="propertyId"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="GA4 Property ID"
                error={!!errors.propertyId}
                helperText={errors.propertyId?.message}
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
                label="Index (order)"
                type="number"
                error={!!errors.index}
                helperText={errors.index?.message}
                disabled={loading}
                {...field}
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                }
              />
            )}
          />

          {config && (
            <>
              <TextField
                fullWidth
                label="Project ID"
                value={config.projectId}
                disabled
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Client Email"
                value={config.clientEmail}
                disabled
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleSubmitForm)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
