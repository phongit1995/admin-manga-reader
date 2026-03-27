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
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICreatePlatformConfigRequest } from '@src/types/platform-config.type';
import { PlatformConfigService } from "@services/platform-config.service";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

const schema = yup.object({
  packageId: yup.string().required('Package ID is required'),
  platform: yup.string().oneOf(['android', 'ios']).required('Platform is required'),
  ironSourceAppKey: yup.string().default(''),
  ironSourceUserId: yup.string().default(''),
  ironSourceInterstitialAdUnitId: yup.string().default(''),
  applovinSdkKey: yup.string().default(''),
  applovinInterstitialAdUnit: yup.string().default(''),
  isRandomAds: yup.boolean().default(false),
  isShowApplovin: yup.boolean().default(false),
  status: yup.boolean().default(true),
}).required();

interface AddPlatformConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPlatformConfigModal({ open, onClose, onSuccess }: AddPlatformConfigModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePlatformConfigRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      packageId: '',
      platform: 'android',
      ironSourceAppKey: '',
      ironSourceUserId: '',
      ironSourceInterstitialAdUnitId: '',
      applovinSdkKey: '',
      applovinInterstitialAdUnit: '',
      isRandomAds: false,
      isShowApplovin: false,
      status: true,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      reset({
        packageId: '',
        platform: 'android',
        ironSourceAppKey: '',
        ironSourceUserId: '',
        ironSourceInterstitialAdUnitId: '',
        applovinSdkKey: '',
        applovinInterstitialAdUnit: '',
        isRandomAds: false,
        isShowApplovin: false,
        status: true,
      });
    }
  }, [open, reset]);

  const handleAdd = async (data: ICreatePlatformConfigRequest) => {
    try {
      setLoading(true);
      const response = await PlatformConfigService.createPlatformConfig(data);
      if (response && response.data) {
        reset();
        onClose();
        onSuccess();
        toast.success('Platform Config added successfully');
      } else {
        toast.error(response?.message || 'Failed to add platform config');
      }
    } catch (error) {
      console.error('Error creating platform config:', error);
      toast.error('Failed to add platform config');
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

  const handleDialogClose = (_event: any, reason: string) => {
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
      <DialogTitle>Add New Platform Config</DialogTitle>
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
                  placeholder="com.mobile.metruyentranh"
                  error={!!errors.packageId}
                  helperText={errors.packageId?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  select
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
              name="ironSourceAppKey"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="IronSource App Key"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="ironSourceUserId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="IronSource User ID"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="ironSourceInterstitialAdUnitId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="IronSource Interstitial Ad Unit ID"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="applovinSdkKey"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="AppLovin SDK Key"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="applovinInterstitialAdUnit"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="AppLovin Interstitial Ad Unit"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="isShowApplovin"
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
                  label="Show AppLovin Ads"
                />
              )}
            />

            <Controller
              name="isRandomAds"
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
                  label="Random Ads"
                />
              )}
            />

            <Controller
              name="status"
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
                  label="Status (Active)"
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
          onClick={handleSubmit(handleAdd)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
