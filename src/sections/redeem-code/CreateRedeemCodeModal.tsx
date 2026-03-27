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
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ICreateRedeemCodeRequest } from "@src/types/redeem-code.type";
import { RedeemCodeService } from "@services/redeem-code.service";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const schema = yup.object({
  code: yup.string().default(""),
  prefix: yup.string().default(""),
  vipDays: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .typeError("Must be a number")
    .required("VIP Days is required")
    .min(1, "Must be at least 1"),
  type: yup.string().oneOf(["1_day", "7_days", "30_days", "event", "custom"]).default("custom"),
  expiresAt: yup.string().default(""),
  description: yup.string().default(""),
}).required();

interface CreateRedeemCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRedeemCodeModal({ open, onClose, onSuccess }: CreateRedeemCodeModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreateRedeemCodeRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      code: "",
      prefix: "VIP",
      vipDays: 30,
      type: "30_days",
      expiresAt: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset({
        code: "",
        prefix: "VIP",
        vipDays: 30,
        type: "30_days",
        expiresAt: "",
        description: "",
      });
    }
  }, [open, reset]);

  const handleCreate = async (data: ICreateRedeemCodeRequest) => {
    try {
      setLoading(true);
      const request: ICreateRedeemCodeRequest = {
        vipDays: Number(data.vipDays),
        type: data.type,
      };
      if (data.code) request.code = data.code;
      if (data.prefix) request.prefix = data.prefix;
      if (data.expiresAt) request.expiresAt = data.expiresAt;
      if (data.description) request.description = data.description;

      const response = await RedeemCodeService.createRedeemCode(request);
      if (response && response.data) {
        reset();
        onClose();
        onSuccess();
        toast.success("Redeem code created successfully");
      } else {
        toast.error(response?.message || "Failed to create redeem code");
      }
    } catch (error) {
      console.error("Error creating redeem code:", error);
      toast.error("Failed to create redeem code");
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
    if (reason !== "backdropClick" || !loading) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm" disableEscapeKeyDown={loading}>
      <DialogTitle>Create Redeem Code</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Code (optional)"
                  placeholder="Leave empty to auto-generate"
                  helperText="Custom code or leave blank for auto-generated"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="prefix"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Prefix"
                  placeholder="e.g. VIP, EVENT"
                  helperText="Prefix for auto-generated codes"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField fullWidth select label="Type" disabled={loading} {...field}>
                  <MenuItem value="1_day">1 Day</MenuItem>
                  <MenuItem value="7_days">7 Days</MenuItem>
                  <MenuItem value="30_days">30 Days</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="vipDays"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="VIP Days *"
                  type="number"
                  error={!!errors.vipDays}
                  helperText={errors.vipDays?.message}
                  InputProps={{ inputProps: { min: 1 } }}
                  disabled={loading}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="expiresAt"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Expires At (optional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  helperText="Code expiration date"
                  disabled={loading}
                  {...field}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Description (optional)"
                  placeholder="e.g. VIP reward for event"
                  multiline
                  rows={2}
                  disabled={loading}
                  {...field}
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(handleCreate)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
