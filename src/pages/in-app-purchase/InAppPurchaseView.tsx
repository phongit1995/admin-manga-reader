import { useEffect, useState, useCallback, ChangeEvent } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
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
import { ConfirmDeleteModal } from '@components/confirm-delete-modal';
import { CommonTableHead } from '@components/table';
import { LoadingOverlay } from '@components/loading-overlay';
import { toast } from "react-toastify";

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

const TABLE_HEAD = [
  { id: 'source', label: 'Source', width: 100 },
  { id: 'bundleId', label: 'Bundle ID', width: 200 },
  { id: 'productId', label: 'Product ID', width: 200 },
  { id: 'purchaseDate', label: 'Purchase Date' },
  { id: 'price', label: 'Price', align: 'right' as const },
  { id: '', label: '' },
];

export default function InAppPurchaseView() {
  const [purchaseList, setPurchaseList] = useState<IInAppPurchaseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<IInAppPurchaseModel | null>(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [purchaseData, setPurchaseData] = useState<{total: number; data: IInAppPurchaseModel[]} | null>(null);

  const fetchPurchaseList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await InAppPurchaseService.getListInAppPurchase({
        page: currentPage + 1,
        pageSize
      });
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setPurchaseList(response.data);
          setPurchaseData({ total: response.data.length, data: response.data });
        } else if (response.data.data) {
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

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
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
          <LoadingOverlay loading={loading} />

          <Table sx={{ minWidth: 800 }}>
            <CommonTableHead
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
          <Box>
            <Typography variant="body2" component="span">
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, purchaseData?.total || 0)} of ${purchaseData?.total || 0} items`}
            </Typography>
          </Box>

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

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete In-App Purchase"
        itemName={selectedPurchase?.productId}
        extraInfo={selectedPurchase ? [
          { label: 'Transaction ID', value: selectedPurchase.transactionId },
        ] : undefined}
        onConfirm={async () => {
          if (!selectedPurchase) return;
          await InAppPurchaseService.deleteInAppPurchase(selectedPurchase._id);
          toast.success('In-App Purchase deleted successfully');
          fetchPurchaseList(page, rowsPerPage);
        }}
      />
    </DashboardContent>
  );
}