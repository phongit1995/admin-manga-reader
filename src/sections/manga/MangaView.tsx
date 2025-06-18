import type { IMangaModel, IResponsePage } from "src/types";

import { useEffect, useState, useCallback, ChangeEvent } from "react";

import { MangaService } from "@services/manga-service";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  CircularProgress,
  TablePagination,
  TextField,
  Button,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { TableEmptyRows } from "src/sections/user/table-empty-rows";
import { TableNoData } from "src/sections/user/table-no-data";
import { emptyRows, applyFilter, getComparator } from "./utils";

import { MangaTableHead } from "./manga-table-head";
import { MangaTableRow } from "./manga-table-row";
import { MangaTableToolbar } from "./manga-table-toolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 280 },
  { id: 'genres', label: 'Genres', width: 120 },
  { id: 'totalChapters', label: 'Chapters', align: 'center' as const },
  { id: 'views', label: 'Views', align: 'center' as const },
  { id: 'chapterUpdate', label: 'Last Updated', align: 'center' as const },
  { id: 'status', label: 'Status' },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export default function MangaView() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [mangaList, setMangaList] = useState<IMangaModel[]>([]);
  const [mangaData, setMangaData] = useState<IResponsePage<IMangaModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [goToPage, setGoToPage] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchMangaList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      const response = await MangaService.getListManga({ 
        page: currentPage + 1, // API uses 1-based indexing
        pageSize: pageSize,
        search: filterName || undefined 
      });
      
      if (response.data) {
        setMangaData(response.data);
        setMangaList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching manga list:', error);
    } finally {
      setLoading(false);
    }
  }, [filterName]);

  useEffect(() => {
    fetchMangaList(page, rowsPerPage);
  }, [fetchMangaList, page, rowsPerPage]);

  const handleSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  }, [order, orderBy]);

  const handleSelectAllClick = useCallback((checked: boolean) => {
    if (checked) {
      const newSelected = mangaList.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [mangaList]);

  const handleClick = useCallback((id: string) => {
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
  }, [selected]);

  const handleFilterByName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0); // Reset to first page when filtering
  }, []);

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1); // Pagination component is 1-indexed, but our state is 0-indexed
  }, []);

  const handleGoToPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGoToPage(event.target.value);
  }, []);

  const handleGoToPageSubmit = useCallback(() => {
    const pageNumber = parseInt(goToPage, 10);
    if (
      !isNaN(pageNumber) && 
      pageNumber > 0 && 
      pageNumber <= Math.ceil((mangaData?.total || 0) / rowsPerPage)
    ) {
      setPage(pageNumber - 1); // Convert to 0-indexed
      setGoToPage(''); // Clear input after navigation
    }
  }, [goToPage, mangaData?.total, rowsPerPage]);

  // We're not applying client-side filtering for pagination since we're using server pagination
  const dataFiltered = mangaList;
  const notFound = !dataFiltered.length && !!filterName;
  const emptyRowsCount = mangaList.length === 0 ? rowsPerPage : 0;
  const totalPages = Math.ceil((mangaData?.total || 0) / rowsPerPage);

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
          Manga List
        </Typography>
      </Box>

      <Card>
        <MangaTableToolbar 
          numSelected={selected.length} 
          filterName={filterName} 
          onFilterName={handleFilterByName} 
        />

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
            <MangaTableHead
              order={order}
              orderBy={orderBy}
              rowCount={mangaList.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {dataFiltered.map((row) => (
                <MangaTableRow
                  key={row._id}
                  row={row}
                  selected={selected.includes(row._id)}
                  onSelectRow={() => handleClick(row._id)}
                />
              ))}

              {emptyRowsCount > 0 && <TableEmptyRows height={68} emptyRows={emptyRowsCount} />}

              {notFound && <TableNoData searchQuery={filterName} />}
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
          {/* Show items information */}
          <Box>
            <Typography variant="body2" component="span">
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, mangaData?.total || 0)} of ${mangaData?.total || 0} items`}
            </Typography>
          </Box>
          
          {/* Main pagination component */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Pagination 
              page={page + 1} 
              count={totalPages}
              onChange={handleChangePage}
              color="primary"
              siblingCount={2} // Show more siblings
              boundaryCount={1} // Show boundary pages
              showFirstButton 
              showLastButton
            />
            
            {/* Go to Page functionality */}
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Go to"
                size="small"
                value={goToPage}
                onChange={handleGoToPageChange}
                type="number"
                InputProps={{ inputProps: { min: 1, max: totalPages } }}
                sx={{ width: 80 }}
              />
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleGoToPageSubmit}
                disabled={!goToPage}
              >
                Go
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </DashboardContent>
  );
}
