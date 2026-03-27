import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  MenuItem,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DashboardContent } from "src/layouts/dashboard";
import { NotificationService } from "@services/notification.service";
import { NotificationSourceService } from "@services/notification-source.service";
import { INotificationSourceModel } from "@src/types/notification-source.type";
import { ISendNotificationRequest } from "@src/types/notification.type";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

const schema = yup.object({
  notificationSourceId: yup.string().default(""),
  deviceToken: yup.string().default(""),
  topic: yup.string().default(""),
  title: yup.string().required("Title is required"),
  body: yup.string().required("Body is required"),
}).test(
  "topic-or-device",
  "Either Topic or Device Token is required",
  (values) => !!(values.topic || values.deviceToken)
).required();

type FormValues = {
  notificationSourceId: string;
  deviceToken: string;
  topic: string;
  title: string;
  body: string;
};

export const SendNotificationView = () => {
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<INotificationSourceModel[]>([]);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      notificationSourceId: "",
      deviceToken: "",
      topic: "all",
      title: "🔥 New Update Available!",
      body: "Check out the latest manga chapters now!",
    },
    mode: "onChange",
  });

  const topicValue = watch("topic");
  const deviceTokenValue = watch("deviceToken");
  const hasTopicOrDevice = !!(topicValue || deviceTokenValue);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await NotificationSourceService.getListNotificationSource();
        let sourceList: INotificationSourceModel[] = [];

        if (response) {
          if (Array.isArray(response)) {
            sourceList = response;
          } else if (typeof response === 'object' && response !== null) {
            const responseObj = response as Record<string, any>;
            if (responseObj.data && Array.isArray(responseObj.data)) {
              sourceList = responseObj.data;
            }
          }
        }

        // Only show enabled sources
        setSources(sourceList.filter((s) => s.enable));
      } catch (error) {
        console.error("Error fetching notification sources:", error);
      }
    };
    fetchSources();
  }, []);

  const handleSend = async (data: FormValues) => {
    if (!data.topic && !data.deviceToken) {
      toast.error("Either Topic or Device Token is required");
      return;
    }

    try {
      setLoading(true);
      setLastResult(null);

      const request: ISendNotificationRequest = {
        title: data.title,
        body: data.body,
      };

      if (data.topic) request.topic = data.topic;
      if (data.deviceToken) request.deviceToken = data.deviceToken;
      if (data.notificationSourceId) request.notificationSourceId = data.notificationSourceId;

      await NotificationService.sendNotification(request);
      toast.success("Notification sent successfully!");
      setLastResult({ success: true, message: "Notification sent successfully!" });
    } catch (error: any) {
      console.error("Error sending notification:", error);
      const errorMsg = error?.response?.data?.message || "Failed to send notification";
      toast.error(errorMsg);
      setLastResult({ success: false, message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Send Notification</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Send push notification via FCM by topic or device token
        </Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 600 }}>
        <Box component="form" noValidate>
          <Stack spacing={3}>
            {/* 1. Notification Source */}
            <Controller
              name="notificationSourceId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  select
                  label="Notification Source"
                  helperText="Select a source or 'All' to send to all sources"
                  disabled={loading}
                  {...field}
                >
                  <MenuItem value="">
                    <em>All Sources</em>
                  </MenuItem>
                  {sources.map((source) => (
                    <MenuItem key={source._id} value={source._id}>
                      {source.name} ({source.projectId})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* 2. Device Token */}
            <Controller
              name="deviceToken"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Device Token"
                  placeholder="e.g. dGhpcyBpcyBhIGRldmljZSB0b2tlbg..."
                  helperText={
                    !hasTopicOrDevice
                      ? "⚠️ Either Device Token or Topic is required"
                      : "Send to a specific device (optional if Topic is set)"
                  }
                  error={!hasTopicOrDevice}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            {/* 3. Topic */}
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Topic"
                  placeholder="e.g. all, news, manga_update"
                  helperText={
                    !hasTopicOrDevice
                      ? "⚠️ Either Topic or Device Token is required"
                      : "Send to all devices subscribed to this topic (optional if Device Token is set)"
                  }
                  error={!hasTopicOrDevice}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            {/* 4. Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Title *"
                  placeholder="e.g. 🔥 New Update Available!"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            {/* 5. Body */}
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Body *"
                  placeholder="e.g. Check out the latest manga chapters now!"
                  multiline
                  rows={3}
                  error={!!errors.body}
                  helperText={errors.body?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />

            {!hasTopicOrDevice && (
              <Alert severity="warning">
                You must provide at least one of <strong>Device Token</strong> or <strong>Topic</strong> to send a notification.
              </Alert>
            )}

            {lastResult && (
              <Alert severity={lastResult.success ? "success" : "error"}>
                {lastResult.message}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit(handleSend)}
              disabled={loading || !hasTopicOrDevice}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Icon icon="mingcute:send-fill" width={20} />
                )
              }
              sx={{ alignSelf: "flex-start" }}
            >
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </DashboardContent>
  );
};
