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
  Checkbox,
  IconButton,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { IInAppPurchaseModel } from "@src/types/in-app-purchase.type";
import { InAppPurchaseService } from "@src/services/in-app-purchase.service";
import { Iconify } from "src/components/iconify";
import DeleteInAppPurchaseModal from "./DeleteInAppPurchaseModal";
import { toast } from "react-toastify";

// Table components
interface InAppPurchaseTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const InAppPurchaseTableHead = ({ headLabel }: InAppPurchaseTableHeadProps) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      
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

interface InAppPurchaseTableRowProps {
  row: IInAppPurchaseModel;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteClick: (purchase: IInAppPurchaseModel) => void;
}

const InAppPurchaseTableRow = ({ row, selected, onSelectRow, onDeleteClick }: InAppPurchaseTableRowProps) => (
  <TableRow hover selected={selected}>
    <TableCell padding="checkbox">
      <Checkbox checked={selected} onClick={onSelectRow} />
    </TableCell>
    
    <TableCell>
      <Typography variant="body2">{row.source}</Typography>
    </TableCell>
    
    <TableCell>
      <Typography variant="body2">{row.bundleId}</Typography>
    </TableCell>
    
    <TableCell>
      <Typography variant="body2">{row.productId}</Typography>
    </TableCell>
    
    <TableCell>
      {new Date(row.purchaseDate).toLocaleDateString()}
    </TableCell>
    
    <TableCell align="right">
      {row.price.toLocaleString()} {row.currency}
    </TableCell>
    
    <TableCell align="right">
      <IconButton onClick={() => onDeleteClick(row)}>
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
      </IconButton>
    </TableCell>
  </TableRow>
);

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'source', label: 'Source', width: 100 },
  { id: 'bundleId', label: 'Bundle ID', width: 200 },
  { id: 'productId', label: 'Product ID', width: 200 },
  { id: 'purchaseDate', label: 'Purchase Date' },
  { id: 'price', label: 'Price', align: 'right' as const },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export default function InAppPurchaseView() {
  const [selected, setSelected] = useState<string[]>([]);
  const [purchaseList, setPurchaseList] = useState<IInAppPurchaseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<IInAppPurchaseModel | null>(null);

  const fetchPurchaseList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await InAppPurchaseService.getListInAppPurchase({page: 1, pageSize: 10});
      if (response && response.data && Array.isArray(response.data)) {
        setPurchaseList(response.data);
      }
    } catch (error) {
      console.error('Error fetching in-app purchase list:', error);
      toast.error('Failed to fetch in-app purchases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseList();
  }, [fetchPurchaseList]);

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteClick = (purchase: IInAppPurchaseModel) => {
    setSelectedPurchase(purchase);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedPurchase(null);
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          In-App Purchases
        </Typography>
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
            <InAppPurchaseTableHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {purchaseList.map((row) => (
                <InAppPurchaseTableRow
                  key={row._id}
                  row={row}
                  selected={selected.includes(row._id)}
                  onSelectRow={() => handleSelectRow(row._id)}
                  onDeleteClick={handleDeleteClick}
                />
              ))}

              {!purchaseList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No In-App Purchases Found
                      </Typography>
                      <Typography variant="body2">
                        No in-app purchases available.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <DeleteInAppPurchaseModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        purchase={selectedPurchase}
        onSuccess={fetchPurchaseList}
      />
    </DashboardContent>
  );
}