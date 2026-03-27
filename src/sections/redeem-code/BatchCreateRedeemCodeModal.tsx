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
  Alert,
  Typography,
  Chip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IBatchCreateRedeemCodeRequest } from "@src/types/redeem-code.type";
import { RedeemCodeService } from "@services/redeem-code.service";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const schema = yup.object({
  quantity: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .typeError("Must be a number")
    .required("Quantity is required")
    .min(1, "Min 1")
    .max(500, "Max 500"),
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

interface BatchCreateRedeemCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BatchCreateRedeemCodeModal({ open, onClose, onSuccess }: BatchCreateRedeemCodeModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; codes: string[] } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IBatchCreateRedeemCodeRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      quantity: 10,
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
      setResult(null);
      reset({
        quantity: 10,
        prefix: "VIP",
        vipDays: 30,
        type: "30_days",
        expiresAt: "",
        description: "",
      });
    }
  }, [open, reset]);

  const handleBatchCreate = async (data: IBatchCreateRedeemCodeRequest) => {
    try {
      setLoading(true);
      setResult(null);
      const request: IBatchCreateRedeemCodeRequest = {
        quantity: Number(data.quantity),
        vipDays: Number(data.vipDays),
        type: data.type,
      };
      if (data.prefix) request.prefix = data.prefix;
      if (data.expiresAt) request.expiresAt = data.expiresAt;
      if (data.description) request.description = data.description;

      const response = await RedeemCodeService.batchCreateRedeemCode(request);
      if (response && response.data) {
        const responseData = response.data as any;
        setResult({
          count: responseData.count || data.quantity,
          codes: responseData.codes || [],
        });
        onSuccess();
        toast.success(`${responseData.count || data.quantity} codes created!`);
      } else {
        toast.error(response?.message || "Failed to batch create");
      }
    } catch (error) {
      console.error("Error batch creating:", error);
      toast.error("Failed to batch create redeem codes");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (result?.codes) {
      navigator.clipboard.writeText(result.codes.join("\n"));
      toast.success("All codes copied to clipboard!");
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setResult(null);
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
      <DialogTitle>Batch Create Redeem Codes</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Quantity *"
                  type="number"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message || "Number of codes (1-500)"}
                  InputProps={{ inputProps: { min: 1, max: 500 } }}
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
              name="prefix"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Prefix"
                  placeholder="e.g. VIP, EVENT, PROMO"
                  helperText="Prefix for generated codes"
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
                  placeholder="e.g. Promo event March 2026"
                  multiline
                  rows={2}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            {/* Results */}
            {result && (
              <Alert
                severity="success"
                action={
                  <Button color="inherit" size="small" onClick={handleCopyAll}>
                    Copy All
                  </Button>
                }
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Created {result.count} codes:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxHeight: 200, overflowY: "auto" }}>
                  {result.codes.map((code) => (
                    <Chip
                      key={code}
                      label={code}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        toast.success(`Copied: ${code}`);
                      }}
                      sx={{ fontFamily: "monospace", cursor: "pointer" }}
                    />
                  ))}
                </Box>
              </Alert>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {result ? "Close" : "Cancel"}
        </Button>
        {!result && (
          <Button
            variant="contained"
            onClick={handleSubmit(handleBatchCreate)}
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            {loading ? "Creating..." : "Batch Create"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
