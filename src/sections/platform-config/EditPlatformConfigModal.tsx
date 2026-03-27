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
import { IPlatformConfigModel, IUpdatePlatformConfigRequest } from '@src/types/platform-config.type';
import { PlatformConfigService } from "@services/platform-config.service";

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

type FormValues = {
  packageId: string;
  platform: string;
  ironSourceAppKey: string;
  ironSourceUserId: string;
  ironSourceInterstitialAdUnitId: string;
  applovinSdkKey: string;
  applovinInterstitialAdUnit: string;
  isRandomAds: boolean;
  isShowApplovin: boolean;
  status: boolean;
};

interface EditPlatformConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  config: IPlatformConfigModel | null;
}

export default function EditPlatformConfigModal({
  open,
  onClose,
  onSuccess,
  config,
}: EditPlatformConfigModalProps) {
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
    if (open && config) {
      reset({
        packageId: config.packageId || '',
        platform: config.platform || 'android',
        ironSourceAppKey: config.ironSourceAppKey || '',
        ironSourceUserId: config.ironSourceUserId || '',
        ironSourceInterstitialAdUnitId: config.ironSourceInterstitialAdUnitId || '',
        applovinSdkKey: config.applovinSdkKey || '',
        applovinInterstitialAdUnit: config.applovinInterstitialAdUnit || '',
        isRandomAds: !!config.isRandomAds,
        isShowApplovin: !!config.isShowApplovin,
        status: config.status !== undefined ? !!config.status : true,
      });
    }
  }, [open, config, reset]);

  const handleUpdate = async (data: FormValues) => {
    try {
      if (!config?._id) {
        toast.error('Platform Config ID not found');
        return;
      }

      setLoading(true);

      const requestData: IUpdatePlatformConfigRequest = {
        packageId: data.packageId,
        platform: data.platform as 'android' | 'ios',
        ironSourceAppKey: data.ironSourceAppKey,
        ironSourceUserId: data.ironSourceUserId,
        ironSourceInterstitialAdUnitId: data.ironSourceInterstitialAdUnitId,
        applovinSdkKey: data.applovinSdkKey,
        applovinInterstitialAdUnit: data.applovinInterstitialAdUnit,
        isRandomAds: data.isRandomAds,
        isShowApplovin: data.isShowApplovin,
        status: data.status,
      };

      const response = await PlatformConfigService.updatePlatformConfig(config._id, requestData);

      if (response) {
        onClose();
        onSuccess();
        toast.success('Platform Config updated successfully');
      } else {
        toast.error('Failed to update platform config');
      }
    } catch (error) {
      console.error('Error updating platform config:', error);
      toast.error('Failed to update platform config');
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
      <DialogTitle>Edit Platform Config</DialogTitle>
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
          onClick={handleSubmit(handleUpdate)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
