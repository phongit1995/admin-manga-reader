import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Box,
  Typography,
} from "@mui/material";
import { IAppConfigModel } from "@src/types/app-config.types";
import AppConfigService from "@src/services/app-config.service";
import { toast } from "react-toastify";
import AppConfigTableRow from "./AppConfigTableRow";
import { CommonTableHead } from '@components/table';
import { LoadingOverlay } from '@components/loading-overlay';

const TABLE_HEAD = [
  { id: 'source', label: 'Source', width: 150 },
  { id: 'showFakeApp', label: 'Show Fake App', align: 'center' as const, width: 120 },
  { id: 'imageResource', label: 'Image Resource', width: 150 },
  { id: 'readImageHeader', label: 'Read Image Header', width: 200 },
  { id: 'imageHeader', label: 'Image Header', width: 200 },
  { id: 'createdAt', label: 'Created At', width: 120 },
  { id: 'updatedAt', label: 'Updated At', width: 120 },
  { id: 'actions', label: '', width: 100 },
];

interface AppConfigTableProps {
  configList: IAppConfigModel[];
  loading: boolean;
  onEdit: (config: IAppConfigModel) => void;
  onDelete: (config: IAppConfigModel) => void;
  onStatusChange: () => void;
}

export default function AppConfigTable({ 
  configList, 
  loading,
  onEdit,
  onDelete,
  onStatusChange
}: AppConfigTableProps) {
  const handleToggleStatus = async (id: string, value: boolean) => {
    try {
      if (!id) {
        toast.error('Config ID not found');
        return;
      }

      const updateData = {
        showFakeApp: value
      };
      
      console.log(`Updating showFakeApp to ${value}`);
      
      await AppConfigService.updateAppConfig(id, updateData);
      
      toast.success('Status updated successfully');

      onStatusChange();
    } catch (error) {
      console.error(`Error updating status:`, error);
      toast.error(`Failed to update status`);
      throw error; // Re-throw so the component can handle its own state
    }
  };
  
  return (
    <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 200 }}>
      <LoadingOverlay loading={loading} />
      
      <Table sx={{ minWidth: 800 }}>
        <CommonTableHead
          headLabel={TABLE_HEAD}
        />
        <TableBody>
          {configList.map((row) => (
            <AppConfigTableRow
              key={row._id}
              row={row}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}

          {!configList.length && !loading && (
            <TableRow>
              <TableCell colSpan={8}>
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No App Configurations Found
                  </Typography>
                  <Typography variant="body2">
                    No app configurations available.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 