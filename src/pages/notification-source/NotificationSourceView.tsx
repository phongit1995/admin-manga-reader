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
import DeleteNotificationSourceModal from "./DeleteNotificationSourceModal";

export default function NotificationSourceView() {
  const [notificationSourceList, setNotificationSourceList] = useState<INotificationSourceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedNotificationSource, setSelectedNotificationSource] = useState<INotificationSourceModel | null>(null);

  const fetchNotificationSourceList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await NotificationSourceService.getListNotificationSource();
      
      if (response) {
        // Handle different possible response formats
        if (Array.isArray(response)) {
          setNotificationSourceList(response);
        } else if (typeof response === 'object' && response !== null) {
          // Check if response has a data property that's an array
          const responseObj = response as Record<string, any>;
          if (responseObj.data && Array.isArray(responseObj.data)) {
            setNotificationSourceList(responseObj.data);
          } else {
            // If it's a single object, put it in an array
            setNotificationSourceList([response as INotificationSourceModel]);
          }
        } else {
          // Fallback to empty array
          setNotificationSourceList([]);
          console.warn('Unexpected API response format:', response);
        }
      } else {
        setNotificationSourceList([]);
      }
    } catch (error) {
      console.error('Error fetching notification source list:', error);
      toast.error('Failed to fetch notification sources');
      setNotificationSourceList([]);
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
    setSelectedNotificationSource(notificationSource);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedNotificationSource(null);
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
        onRefresh={fetchNotificationSourceList}
      />

      <AddNotificationSourceModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={fetchNotificationSourceList}
      />

      <DeleteNotificationSourceModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onSuccess={fetchNotificationSourceList}
        notificationSource={selectedNotificationSource}
      />
    </DashboardContent>
  );
}
