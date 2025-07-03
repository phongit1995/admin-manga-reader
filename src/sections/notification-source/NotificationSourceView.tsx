import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { INotificationSourceModel } from "@src/types/notification-source.type";
import { NotificationSourceService } from "@services/notification-source.service";
import { toast } from "react-toastify";
import { Iconify } from "src/components/iconify";
import NotificationSourceTable from "./NotificationSourceTable";
import AddNotificationSourceModal from "./AddNotificationSourceModal";

export default function NotificationSourceView() {
  const [notificationSourceList, setNotificationSourceList] = useState<INotificationSourceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const fetchNotificationSourceList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await NotificationSourceService.getListNotificationSource();
      if (response && response.data?.data) {
        setNotificationSourceList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notification source list:', error);
      toast.error('Failed to fetch notification sources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationSourceList();
  }, [fetchNotificationSourceList]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleDeleteClick = (notificationSource: INotificationSourceModel) => {
    // Delete functionality will be implemented later
    console.log('Delete clicked for:', notificationSource);
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">
          Notification Sources
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={handleOpenAddModal}
        >
          Add Notification Source
        </Button>
      </Box>

      <NotificationSourceTable
        notificationSourceList={notificationSourceList}
        loading={loading}
        onDeleteClick={handleDeleteClick}
      />

      <AddNotificationSourceModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={fetchNotificationSourceList}
      />
    </DashboardContent>
  );
}
