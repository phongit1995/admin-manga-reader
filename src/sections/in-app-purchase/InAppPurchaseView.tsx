import { useEffect, useState, useCallback, ChangeEvent } from "react";
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
  Stack,
  Pagination,
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
  onDeleteClick: (purchase: IInAppPurchaseModel) => void;
}

const InAppPurchaseTableRow = ({ row, onDeleteClick }: InAppPurchaseTableRowProps) => (
  <TableRow hover>
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
      {new Date(row.purchaseDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })} {new Date(row.purchaseDate).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
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
  const [purchaseList, setPurchaseList] = useState<IInAppPurchaseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<IInAppPurchaseModel | null>(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [purchaseData, setPurchaseData] = useState<{total: number; data: IInAppPurchaseModel[]} | null>(null);

  const fetchPurchaseList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await InAppPurchaseService.getListInAppPurchase({
        page: currentPage + 1, // API uses 1-based indexing
        pageSize
      });
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setPurchaseList(response.data);
          // If API doesn't return total, we'll just use the array length
          setPurchaseData({ total: response.data.length, data: response.data });
        } else if (response.data.data) {
          // Handle paginated response format
          setPurchaseList(response.data.data);
          setPurchaseData(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching in-app purchase list:', error);
      toast.error('Failed to fetch in-app purchases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseList(page, rowsPerPage);
  }, [fetchPurchaseList, page, rowsPerPage]);

  const handleDeleteClick = (purchase: IInAppPurchaseModel) => {
    setSelectedPurchase(purchase);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedPurchase(null);
  };

  // Pagination handlers
  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // Pagination component is 1-indexed, but our state is 0-indexed
  }, []);

  const totalPages = Math.ceil((purchaseData?.total || 0) / rowsPerPage);

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
                  onDeleteClick={handleDeleteClick}
                />
              ))}

              {!purchaseList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={6}>
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
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, purchaseData?.total || 0)} of ${purchaseData?.total || 0} items`}
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

      <DeleteInAppPurchaseModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        purchase={selectedPurchase}
        onSuccess={() => fetchPurchaseList(page, rowsPerPage)}
      />
    </DashboardContent>
  );
}