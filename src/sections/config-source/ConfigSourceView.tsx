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
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { IConfigSourceModel } from "@src/types/config-source.type";
import { ConfigSourceService } from "@services/config-source.service";
import { Iconify } from "src/components/iconify";
import { toast } from "react-toastify";
import AddConfigSourceModal from "./AddConfigSourceModal";
import DeleteConfigSourceModal from "./DeleteConfigSourceModal";
import EditConfigSourceModal from "./EditConfigSourceModal";

// Table components
interface ConfigSourceTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const ConfigSourceTableHead = ({ headLabel }: ConfigSourceTableHeadProps) => (
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

interface ConfigSourceTableRowProps {
  row: IConfigSourceModel;
  onEditClick: (configSource: IConfigSourceModel) => void;
  onDeleteClick: (configSource: IConfigSourceModel) => void;
  onToggleEnable: (id: string, value: boolean) => Promise<void>;
}

const ConfigSourceTableRow = ({ row, onEditClick, onDeleteClick, onToggleEnable }: ConfigSourceTableRowProps) => {
  const [loadingEnable, setLoadingEnable] = useState(false);
  
  const handleToggleEnable = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    console.log(`Toggle Enable: ${row.enable} -> ${newValue}`);
    try {
      setLoadingEnable(true);
      await onToggleEnable(row._id || '', newValue);
    } finally {
      setLoadingEnable(false);
    }
  };
  
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.key}</Typography>
      </TableCell>
      
      <TableCell align="center">
        <Switch 
          checked={!!row.enable} 
          onChange={handleToggleEnable}
          disabled={loadingEnable}
        />
      </TableCell>
      
      <TableCell align="center">{row.index}</TableCell>

      <TableCell>
        {new Date(row.createdAt).toLocaleDateString()}
      </TableCell>
      
      <TableCell>
        {new Date(row.updatedAt).toLocaleDateString()}
      </TableCell>
      
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => onEditClick(row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={() => onDeleteClick(row)}>
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 180 },
  { id: 'key', label: 'Key', width: 150 },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: 'index', label: 'Index', align: 'center' as const, width: 80 },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export const ConfigSourceView = () => {
  const [configSourceList, setConfigSourceList] = useState<IConfigSourceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedConfigSource, setSelectedConfigSource] = useState<IConfigSourceModel | null>(null);

  const fetchConfigSourceList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ConfigSourceService.getListConfigSource({
        page: 1,
        pageSize: 100,
      });
      if (response && response.data?.data) {
        setConfigSourceList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching config source list:', error);
      toast.error('Failed to fetch config sources');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigSourceList();
  }, [fetchConfigSourceList]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleEditClick = (configSource: IConfigSourceModel) => {
    setSelectedConfigSource(configSource);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedConfigSource(null);
  };

  const handleDeleteClick = (configSource: IConfigSourceModel) => {
    setSelectedConfigSource(configSource);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedConfigSource(null);
  };

  const handleToggleEnable = async (id: string, value: boolean) => {
    try {
      if (!id) {
        toast.error('Config Source ID not found');
        return;
      }
      
      // Only send the field that needs updating
      const updateData = {
        enable: value
      };
      
      console.log(`Updating enable to ${value}`);
      
      await ConfigSourceService.updateConfigSource(id, updateData);
      
      toast.success('Enable status updated successfully');
      
      // Refresh the list
      fetchConfigSourceList();
    } catch (error) {
      console.error('Error updating enable status:', error);
      toast.error('Failed to update enable status');
      throw error; // Re-throw so the component can handle its own state
    }
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
          Config Sources
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={handleOpenAddModal}
        >
          Add Config Source
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
          
          <Table sx={{ minWidth: 800 }}>
            <ConfigSourceTableHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {configSourceList.map((row) => (
                <ConfigSourceTableRow
                  key={row._id}
                  row={row}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  onToggleEnable={handleToggleEnable}
                />
              ))}

              {!configSourceList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No Config Sources Found
                      </Typography>
                      <Typography variant="body2">
                        Add a new config source to get started.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddConfigSourceModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSuccess={fetchConfigSourceList}
      />

      <DeleteConfigSourceModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        configSource={selectedConfigSource}
        onSuccess={fetchConfigSourceList}
      />

      <EditConfigSourceModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        configSource={selectedConfigSource}
        onSuccess={fetchConfigSourceList}
      />
    </DashboardContent>
  );
};