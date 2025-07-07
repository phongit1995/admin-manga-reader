import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Card, Pagination } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";
import { IAppConfigModel } from "@src/types/app-config.types";
import AppConfigService from "@src/services/app-config.service";
import { toast } from "react-toastify";
import AppConfigTable from "./AppConfigTable";
import AddAppConfigModal from "./AddAppConfigModal";
import EditAppConfigModal from "./EditAppConfigModal";
import DeleteAppConfigModal from "./DeleteAppConfigModal";

export function AppConfigView() {
  const [configList, setConfigList] = useState<IAppConfigModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<IAppConfigModel | null>(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [configData, setConfigData] = useState<{total: number; data: IAppConfigModel[]} | null>(null);

  const fetchConfigList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await AppConfigService.getAppConfigList({
        page: currentPage + 1, // API uses 1-based indexing
        pageSize
      });
      
      if (response && response.data) {
        setConfigList(response.data.data);
        setConfigData(response.data);
      }
    } catch (error) {
      console.error('Error fetching app config list:', error);
      toast.error('Failed to fetch app configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigList(page, rowsPerPage);
  }, [fetchConfigList, page, rowsPerPage]);
  
  // Refresh data after status change
  const handleStatusChange = useCallback(() => {
    fetchConfigList(page, rowsPerPage);
  }, [fetchConfigList, page, rowsPerPage]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleEditConfig = (config: IAppConfigModel) => {
    setSelectedConfig(config);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedConfig(null);
  };

  const handleDeleteConfig = (config: IAppConfigModel) => {
    setSelectedConfig(config);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedConfig(null);
  };

  // Pagination handlers
  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // Pagination component is 1-indexed, but our state is 0-indexed
  }, []);

  const totalPages = Math.ceil((configData?.total || 0) / rowsPerPage);

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
          App Configuration
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={handleOpenAddModal}
        >
          Add App Config
        </Button>
      </Box>

      <Card>
        <AppConfigTable
          configList={configList}
          loading={loading}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
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
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, configData?.total || 0)} of ${configData?.total || 0} items`}
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

      <AddAppConfigModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={() => fetchConfigList(page, rowsPerPage)}
      />

      <EditAppConfigModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={() => fetchConfigList(page, rowsPerPage)}
        config={selectedConfig}
      />

      <DeleteAppConfigModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        config={selectedConfig}
        onSuccess={() => fetchConfigList(page, rowsPerPage)}
      />
    </DashboardContent>
  );
} 