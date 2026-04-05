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
  Chip,
  TablePagination,
  MenuItem,
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { DashboardContent } from "src/layouts/dashboard";
import { IRedeemCodeModel, IListRedeemCodeQuery } from "@src/types/redeem-code.type";
import { RedeemCodeService } from "@services/redeem-code.service";
import { Iconify } from "src/components/iconify";
import { toast } from "react-toastify";
import CreateRedeemCodeModal from "./CreateRedeemCodeModal";
import BatchCreateRedeemCodeModal from "./BatchCreateRedeemCodeModal";

// Table Head
interface RedeemCodeTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: "left" | "center" | "right";
    width?: number;
    minWidth?: number;
  }[];
}

const RedeemCodeTableHead = ({ headLabel }: RedeemCodeTableHeadProps) => (
  <TableHead>
    <TableRow>
      {headLabel.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align || "left"}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

// Table Row
interface RedeemCodeTableRowProps {
  row: IRedeemCodeModel;
  onDisableClick: (code: string) => void;
  disabling: boolean;
}

const statusColorMap: Record<string, "success" | "error" | "warning" | "default" | "info"> = {
  active: "success",
  used: "info",
  expired: "warning",
  disabled: "error",
};

const RedeemCodeTableRow = ({ row, onDisableClick, disabling }: RedeemCodeTableRowProps) => (
  <TableRow hover>
    <TableCell>
      <Tooltip title="Click to copy">
        <Typography
          variant="subtitle2"
          sx={{ fontFamily: "monospace", cursor: "pointer", "&:hover": { color: "primary.main" } }}
          onClick={() => {
            navigator.clipboard.writeText(row.code);
            toast.success("Code copied!");
          }}
        >
          {row.code}
        </Typography>
      </Tooltip>
    </TableCell>

    <TableCell>
      <Chip label={row.type} size="small" variant="outlined" />
    </TableCell>

    <TableCell align="center">
      <Typography variant="body2" fontWeight="bold">
        {row.vipDays}
      </Typography>
    </TableCell>

    <TableCell align="center">
      <Chip label={row.status} size="small" color={statusColorMap[row.status] || "default"} />
    </TableCell>

    <TableCell>
      <Typography variant="body2" color="text.secondary">
        {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : "-"}
      </Typography>
    </TableCell>

    <TableCell>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {row.description || "-"}
      </Typography>
    </TableCell>

    <TableCell>
      <Typography variant="body2" color="text.secondary">
        {new Date(row.createdAt).toLocaleDateString()}
      </Typography>
    </TableCell>

    <TableCell align="right">
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {row.status === "active" && (
          <Tooltip title="Disable this code">
            <IconButton
              onClick={() => onDisableClick(row.code)}
              disabled={disabling}
              color="error"
            >
              <Icon icon="solar:close-circle-bold" width={20} color="#ef4444" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </TableCell>
  </TableRow>
);

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "code", label: "Code", minWidth: 180 },
  { id: "type", label: "Type", width: 100 },
  { id: "vipDays", label: "VIP Days", align: "center" as const, width: 90 },
  { id: "status", label: "Status", align: "center" as const, width: 100 },
  { id: "expiresAt", label: "Expires", width: 110 },
  { id: "description", label: "Description", minWidth: 120 },
  { id: "createdAt", label: "Created", width: 110 },
  { id: "", label: "", width: 60 },
];

// ----------------------------------------------------------------------

export const RedeemCodeView = () => {
  const [codeList, setCodeList] = useState<IRedeemCodeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const query: IListRedeemCodeQuery = {
        page: page + 1,
        pageSize: rowsPerPage,
      };
      if (filterStatus) query.status = filterStatus as any;
      if (filterType) query.type = filterType as any;

      const response = await RedeemCodeService.getListRedeemCode(query);
      if (response && response.data?.data) {
        setCodeList(response.data.data);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching redeem codes:", error);
      toast.error("Failed to fetch redeem codes");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterStatus, filterType]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDisable = async (code: string) => {
    try {
      setDisabling(true);
      await RedeemCodeService.disableRedeemCode(code);
      toast.success(`Code "${code}" disabled`);
      fetchList();
    } catch (error) {
      console.error("Error disabling code:", error);
      toast.error("Failed to disable code");
    } finally {
      setDisabling(false);
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Redeem Codes</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Icon icon="material-symbols:content-copy-outline" width={20} />}
            onClick={() => setOpenBatchModal(true)}
          >
            Batch Create
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenCreateModal(true)}
          >
            Create Code
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="used">Used</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Type"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(0); }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="1_day">1 Day</MenuItem>
          <MenuItem value="7_days">7 Days</MenuItem>
          <MenuItem value="30_days">30 Days</MenuItem>
          <MenuItem value="event">Event</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </TextField>
      </Stack>

      <Card>
        <TableContainer sx={{ position: "relative", overflow: "unset", minHeight: 200 }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Table sx={{ minWidth: 900 }}>
            <RedeemCodeTableHead headLabel={TABLE_HEAD} />
            <TableBody>
              {codeList.map((row) => (
                <RedeemCodeTableRow
                  key={row._id}
                  row={row}
                  onDisableClick={handleDisable}
                  disabling={disabling}
                />
              ))}

              {!codeList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ py: 3, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No Redeem Codes Found
                      </Typography>
                      <Typography variant="body2">
                        Create a new redeem code to get started.
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <CreateRedeemCodeModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={fetchList}
      />

      <BatchCreateRedeemCodeModal
        open={openBatchModal}
        onClose={() => setOpenBatchModal(false)}
        onSuccess={fetchList}
      />
    </DashboardContent>
  );
};
