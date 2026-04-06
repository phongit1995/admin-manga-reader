import { useEffect, useState, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Switch,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CommonTableHead } from '@components/table';
import { LoadingOverlay } from '@components/loading-overlay';
import { ConfirmDeleteModal } from '@components/confirm-delete-modal';
import { AnalyticsService } from '@src/services/analytics.service';

import type { IAnalyticsConfigModel } from '@src/types/analytics.type';

import AddAnalyticsConfigModal from './AddAnalyticsConfigModal';
import EditAnalyticsConfigModal from './EditAnalyticsConfigModal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'NO', align: 'center' as const, width: 50 },
  { id: 'name', label: 'Name', width: 200 },
  { id: 'projectId', label: 'Project ID', width: 180 },
  { id: 'propertyId', label: 'Property ID', width: 140 },
  { id: 'clientEmail', label: 'Client Email' },
  { id: 'index', label: 'Index', align: 'center' as const, width: 70 },
  { id: 'enable', label: 'Enable', align: 'center' as const, width: 90 },
  { id: 'createdAt', label: 'Created', width: 120 },
  { id: 'actions', label: '', width: 100 },
];

// ─── Row ────────────────────────────────────────────────────────────────────

function ConfigRow({
  row,
  order,
  onToggleEnable,
  onEdit,
  onDelete,
}: {
  row: IAnalyticsConfigModel;
  order: number;
  onToggleEnable: (id: string, enable: boolean) => Promise<void>;
  onEdit: (config: IAnalyticsConfigModel) => void;
  onDelete: (config: IAnalyticsConfigModel) => void;
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setToggling(true);
      await onToggleEnable(row._id, event.target.checked);
    } finally {
      setToggling(false);
    }
  };

  return (
    <TableRow hover>
      {/* NO */}
      <TableCell align="center">
        <Typography variant="body2" color="text.secondary">
          {order}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>

      <TableCell>
        <Chip label={row.projectId} size="small" variant="outlined" />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {row.propertyId}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          noWrap
          sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {row.clientEmail}
        </Typography>
      </TableCell>

      {/* Index from API */}
      <TableCell align="center">
        <Typography variant="body2">{row.index ?? '-'}</Typography>
      </TableCell>

      <TableCell align="center">
        <Switch
          checked={row.enable}
          onChange={handleToggle}
          disabled={toggling}
          size="small"
        />
      </TableCell>

      <TableCell>
        <Typography variant="caption" color="text.secondary">
          {dayjs(row.createdAt).format('DD/MM/YYYY')}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(row)}>
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(row)}>
              <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ color: 'error.main' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

// ─── Main View ──────────────────────────────────────────────────────────────

export default function AnalyticsConfigView() {
  const [configList, setConfigList] = useState<IAnalyticsConfigModel[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<IAnalyticsConfigModel | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AnalyticsService.getListConfig();
      if (response?.data) {
        const data = Array.isArray(response.data) ? response.data : (response.data as any).data ?? [];
        setConfigList(data);
      }
    } catch (error) {
      console.error('Error fetching analytics configs:', error);
      toast.error('Failed to fetch analytics configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // Toggle enable
  const handleToggleEnable = useCallback(
    async (id: string, enable: boolean) => {
      try {
        await AnalyticsService.updateConfig(id, { enable });
        toast.success(`Config ${enable ? 'enabled' : 'disabled'} successfully`);
        fetchConfigs();
      } catch (error) {
        console.error('Error toggling config:', error);
        toast.error('Failed to update config status');
      }
    },
    [fetchConfigs]
  );

  // Edit
  const handleEdit = (config: IAnalyticsConfigModel) => {
    setSelectedConfig(config);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedConfig(null);
  };

  // Delete
  const handleDelete = (config: IAnalyticsConfigModel) => {
    setSelectedConfig(config);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedConfig(null);
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
        <Typography variant="h4">Analytics Config</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Config
        </Button>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 200 }}>
          <LoadingOverlay loading={loading} />

          <Table sx={{ minWidth: 860 }}>
            <CommonTableHead headLabel={TABLE_HEAD} />
            <TableBody>
              {configList.map((row, idx) => (
                <ConfigRow
                  key={row._id}
                  row={row}
                  order={idx + 1}
                  onToggleEnable={handleToggleEnable}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {!configList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        No Analytics Configs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add a Google Analytics config to start tracking.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Modal */}
      <AddAnalyticsConfigModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchConfigs}
      />

      {/* Edit Modal */}
      <EditAnalyticsConfigModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={fetchConfigs}
        config={selectedConfig}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete Analytics Config"
        itemName={selectedConfig?.name}
        extraInfo={
          selectedConfig
            ? [
                { label: 'Project ID', value: selectedConfig.projectId },
                { label: 'Property ID', value: selectedConfig.propertyId },
              ]
            : undefined
        }
        onConfirm={async () => {
          if (!selectedConfig) return;
          await AnalyticsService.deleteConfig(selectedConfig._id);
          toast.success('Analytics config deleted successfully');
          fetchConfigs();
        }}
      />
    </DashboardContent>
  );
}
