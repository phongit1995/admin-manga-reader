import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  CircularProgress,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Switch,
  Chip,
  TablePagination,
} from "@mui/material";
import { Icon } from '@iconify/react';
import { DashboardContent } from "src/layouts/dashboard";
import { IPlatformConfigModel } from "@src/types/platform-config.type";
import { PlatformConfigService } from "@services/platform-config.service";
import { Iconify } from "src/components/iconify";
import { toast } from "react-toastify";
import AddPlatformConfigModal from "./AddPlatformConfigModal";
import EditPlatformConfigModal from "./EditPlatformConfigModal";

interface PlatformConfigTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const PlatformConfigTableHead = ({ headLabel }: PlatformConfigTableHeadProps) => (
  <TableHead>
    <TableRow>
      {headLabel.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align || 'left'}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

interface PlatformConfigTableRowProps {
  row: IPlatformConfigModel;
  onEditClick: (config: IPlatformConfigModel) => void;
  onToggleStatus: (id: string, value: boolean) => Promise<void>;
}

const PlatformConfigTableRow = ({ row, onEditClick, onToggleStatus }: PlatformConfigTableRowProps) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleToggleStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    try {
      setLoadingStatus(true);
      await onToggleStatus(row._id || '', newValue);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2">{row.packageId}</Typography>
      </TableCell>

      <TableCell>
        <Chip
          label={row.platform}
          color={row.platform === 'ios' ? 'info' : 'success'}
          size="small"
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
          {row.ironSourceAppKey || '-'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
          {row.applovinSdkKey ? `${row.applovinSdkKey.substring(0, 20)}...` : '-'}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Chip
          label={row.isShowApplovin ? 'AppLovin' : 'IronSource'}
          color={row.isShowApplovin ? 'warning' : 'primary'}
          size="small"
        />
      </TableCell>

      <TableCell align="center">
        {row.isRandomAds ? (
          <Icon icon="eva:checkmark-circle-2-fill" color="#22c55e" width={20} />
        ) : (
          <Icon icon="eva:close-circle-fill" color="#94a3b8" width={20} />
        )}
      </TableCell>

      <TableCell align="center">
        <Switch
          checked={!!row.status}
          onChange={handleToggleStatus}
          disabled={loadingStatus}
        />
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => onEditClick(row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const TABLE_HEAD = [
  { id: 'packageId', label: 'Package ID', minWidth: 200 },
  { id: 'platform', label: 'Platform', width: 100 },
  { id: 'ironSource', label: 'IronSource Key', minWidth: 150 },
  { id: 'applovin', label: 'AppLovin Key', minWidth: 150 },
  { id: 'adProvider', label: 'Ad Provider', align: 'center' as const, width: 120 },
  { id: 'randomAds', label: 'Random Ads', align: 'center' as const, width: 100 },
  { id: 'status', label: 'Status', align: 'center' as const, width: 80 },
  { id: '', label: '', width: 60 },
];

export const PlatformConfigView = () => {
  const [configList, setConfigList] = useState<IPlatformConfigModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<IPlatformConfigModel | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchConfigList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PlatformConfigService.getListPlatformConfig({
        page: page + 1,
        pageSize: rowsPerPage,
      });
      if (response && response.data?.data) {
        setConfigList(response.data.data);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching platform config list:', error);
      toast.error('Failed to fetch platform configs');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchConfigList();
  }, [fetchConfigList]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleEditClick = (config: IPlatformConfigModel) => {
    setSelectedConfig(config);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedConfig(null);
  };

  const handleToggleStatus = async (id: string, value: boolean) => {
    try {
      if (!id) {
        toast.error('Platform Config ID not found');
        return;
      }

      await PlatformConfigService.updatePlatformConfig(id, { status: value });
      toast.success('Status updated successfully');
      fetchConfigList();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      throw error;
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          Platform Config
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenAddModal}
        >
          Add Platform Config
        </Button>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 200 }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Table sx={{ minWidth: 900 }}>
            <PlatformConfigTableHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {configList.map((row) => (
                <PlatformConfigTableRow
                  key={row._id}
                  row={row}
                  onEditClick={handleEditClick}
                  onToggleStatus={handleToggleStatus}
                />
              ))}

              {!configList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No Platform Configs Found
                      </Typography>
                      <Typography variant="body2">
                        Add a new platform config to get started.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          page={page}
          count={total}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <AddPlatformConfigModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={fetchConfigList}
      />

      <EditPlatformConfigModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        config={selectedConfig}
        onSuccess={fetchConfigList}
      />
    </DashboardContent>
  );
};
