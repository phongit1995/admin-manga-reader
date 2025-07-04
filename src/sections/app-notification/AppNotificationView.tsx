import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Pagination,
  Button,
  Card,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { IAppNotificationModel } from "@src/types/app-notification.types";
import AppNotificationService from "@src/services/app-notification.service";
import { toast } from "react-toastify";
import { Iconify } from "src/components/iconify";
import AppNotificationTable from "./AppNotificationTable";
import AddAppNotificationModal from "./AddAppNotificationModal";
import EditAppNotificationModal from "./EditAppNotificationModal";
import DeleteAppNotificationModal from "./DeleteAppNotificationModal";

export default function AppNotificationView() {
  const [notificationList, setNotificationList] = useState<IAppNotificationModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<IAppNotificationModel | null>(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notificationData, setNotificationData] = useState<{total: number; data: IAppNotificationModel[]} | null>(null);

  const fetchNotificationList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await AppNotificationService.getAppNotificationList({
        page: currentPage + 1, // API uses 1-based indexing
        pageSize
      });
      
      if (response && response.data) {
        setNotificationList(response.data.data);
        setNotificationData(response.data);
      }
    } catch (error) {
      console.error('Error fetching app notification list:', error);
      toast.error('Failed to fetch app notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationList(page, rowsPerPage);
  }, [fetchNotificationList, page, rowsPerPage]);
  
  // Refresh data after status change
  const handleStatusChange = useCallback(() => {
    fetchNotificationList(page, rowsPerPage);
  }, [fetchNotificationList, page, rowsPerPage]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleEditNotification = (notification: IAppNotificationModel) => {
    setSelectedNotification(notification);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedNotification(null);
  };

  const handleDeleteNotification = (notification: IAppNotificationModel) => {
    setSelectedNotification(notification);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedNotification(null);
  };

  // Pagination handlers
  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // Pagination component is 1-indexed, but our state is 0-indexed
  }, []);

  const totalPages = Math.ceil((notificationData?.total || 0) / rowsPerPage);

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
          App Notifications
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={handleOpenAddModal}
        >
          Add Notification
        </Button>
      </Box>

      <Card>
        <AppNotificationTable
          notificationList={notificationList}
          loading={loading}
          onEdit={handleEditNotification}
          onDelete={handleDeleteNotification}
          onStatusChange={handleStatusChange}
        />

        {/* Pagination controls */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Show items information */}
          <Box>
            <Typography variant="body2" component="span">
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, notificationData?.total || 0)} of ${notificationData?.total || 0} items`}
            </Typography>
          </Box>
          
          {/* Main pagination component */}
          <Pagination 
            page={page + 1} 
            count={totalPages}
            onChange={handleChangePage}
            color="primary"
            siblingCount={2}
            boundaryCount={1}
            showFirstButton 
            showLastButton
          />
        </Box>
      </Card>

      <AddAppNotificationModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={() => fetchNotificationList(page, rowsPerPage)}
      />

      <EditAppNotificationModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={() => fetchNotificationList(page, rowsPerPage)}
        notification={selectedNotification}
      />

      <DeleteAppNotificationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        notification={selectedNotification}
        onSuccess={() => fetchNotificationList(page, rowsPerPage)}
      />
    </DashboardContent>
  );
}

