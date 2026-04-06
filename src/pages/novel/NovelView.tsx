import type { INovelModel, IResponsePage } from "src/types";
import { TYPE_SORT_NOVEL } from "src/types";
import type { ICategoryModel } from "@src/types/category.type";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

import { NovelService } from "@src/services/novel.service";
import { CategoryService } from "@src/services/category.service";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Stack,
  Pagination,
  useMediaQuery,
  useTheme,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { LoadingOverlay } from "@components/loading-overlay";

import { TableEmptyRows, TableNoData, CommonTableHead, fDate } from '@components/table';

import { NovelTableRow } from "./novel-table-row";
import { NovelTableToolbar } from "./novel-table-toolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 280 },
  { id: 'genres', label: 'Genres', width: 120 },
  { id: 'totalChapters', label: 'Chapters', align: 'center' as const },
  { id: 'views', label: 'Views', align: 'center' as const },
  { id: 'chapterUpdate', label: 'Last Updated', align: 'center' as const },
  { id: 'status', label: 'Status' },
  { id: 'source', label: 'Source' },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export default function NovelView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('');
  const [selectedSort, setSelectedSort] = useState<number>(TYPE_SORT_NOVEL.CHAPTER_NEW);
  const [novelList, setNovelList] = useState<INovelModel[]>([]);
  const [novelData, setNovelData] = useState<IResponsePage<INovelModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategoryModel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getListCategory();
        if (response && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const fetchNovelList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      
      let selectedCategoryName = '';
      if (selectedCategory) {
        const category = categories.find(cat => cat._id === selectedCategory);
        if (category) {
          selectedCategoryName = category.name;
        }
      }
      
      const response = await NovelService.getListNovel({ 
        page: currentPage + 1,
        pageSize,
        search: filterName || undefined,
        genres: selectedCategoryName || undefined,
        status: selectedStatus !== '' ? selectedStatus : undefined,
        sort: selectedSort,
      });
      
      if (response.data) {
        setNovelData(response.data);
        setNovelList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching novel list:', error);
      toast.error('Failed to fetch novel list');
    } finally {
      setLoading(false);
    }
  }, [filterName, selectedCategory, categories, selectedStatus, selectedSort]);

  useEffect(() => {
    fetchNovelList(page, rowsPerPage);
  }, [fetchNovelList, page, rowsPerPage]);

  const handleSelectAllClick = useCallback((checked: boolean) => {
    if (checked) {
      const newSelected = novelList.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [novelList]);

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
    setPage(0);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(0);
  }, []);

  const handleStatusChange = useCallback((status: number | '') => {
    setSelectedStatus(status);
    setPage(0);
  }, []);

  const handleSortChange = useCallback((sort: number) => {
    setSelectedSort(sort);
    setPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedSort(TYPE_SORT_NOVEL.CHAPTER_NEW);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  }, []);

  const handleDisableNovel = useCallback(async (ids: string[]) => {
    try {
      const response = await NovelService.disableNovel(ids);
      if (response) {
        toast.success(`Successfully disabled ${ids.length} novel${ids.length > 1 ? 's' : ''}`);
        fetchNovelList(page, rowsPerPage);
        setSelected([]);
      } else {
        toast.error('Failed to disable novel. Please try again.');
      }
    } catch (error) {
      console.error('Error disabling novel:', error);
      toast.error('An error occurred while disabling novel.');
    }
  }, [page, rowsPerPage, fetchNovelList]);

  const handleEnableNovel = useCallback(async (ids: string[]) => {
    try {
      const response = await NovelService.enableNovel(ids);
      if (response) {
        toast.success(`Successfully enabled ${ids.length} novel${ids.length > 1 ? 's' : ''}`);
        fetchNovelList(page, rowsPerPage);
        setSelected([]);
      } else {
        toast.error('Failed to enable novel. Please try again.');
      }
    } catch (error) {
      console.error('Error enabling novel:', error);
      toast.error('An error occurred while enabling novel.');
    }
  }, [page, rowsPerPage, fetchNovelList]);

  const handleResetImages = useCallback(async (_ids: string[]) => {
    // TODO: API endpoint novel/reset-image does not exist in Swagger
    toast.warning('Reset images is not available for novels.');
  }, []);

  const dataFiltered = novelList;
  const notFound = !dataFiltered.length && !!filterName;
  const emptyRowsCount = novelList.length === 0 ? rowsPerPage : 0;
  const totalPages = Math.ceil((novelData?.total || 0) / rowsPerPage);

  // Mobile Card View renderer for each novel
  const renderNovelCard = (novel: INovelModel) => {
    const isSelected = selected.includes(novel._id);
    
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
          '&:hover': {
            boxShadow: 10,
          },
          mb: 2
        }}
        onClick={() => handleClick(novel._id)}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar 
            src={novel.image} 
            alt={novel.name} 
            sx={{ width: 80, height: 120, borderRadius: 1 }}
            variant="rounded"
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {novel.name}
            </Typography>
            
            <Stack spacing={1}>
              {novel.genres && novel.genres.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {novel.genres.slice(0, 3).map((genre, index) => (
                    <Chip key={index} label={genre} size="small" />
                  ))}
                  {novel.genres.length > 3 && (
                    <Chip label={`+${novel.genres.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Chapters: {novel.totalChapters || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Views: {novel.views?.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  size="small"
                  label={novel.status === 0 ? 'Ongoing' : 'Completed'} 
                  color={novel.status === 0 ? 'primary' : 'success'}
                />
                <Chip 
                  size="small"
                  label={novel.enable ? 'Enabled' : 'Disabled'} 
                  color={novel.enable ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Source: {novel.source}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated: {fDate(novel.chapterUpdate)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    );
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
          Novel List
        </Typography>
      </Box>

      <Card>
        <NovelTableToolbar 
          numSelected={selected.length} 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          onDisable={handleDisableNovel}
          onEnable={handleEnableNovel}
          onResetImages={handleResetImages}
          selectedIds={selected}
        />

        <Box sx={{ position: 'relative', minHeight: 200 }}>
          <LoadingOverlay loading={loading} />
          
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {dataFiltered.length > 0 ? (
                dataFiltered.map((novel) => renderNovelCard(novel))
              ) : (
                <Box>
                  {notFound ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h6">No results found</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        No results found for &nbsp;
                        <strong>&quot;{filterName}&quot;</strong>.
                        <br /> Try checking for typos or using complete words.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h6">No novel found</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        No novel available with the current filters.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CommonTableHead
                  rowCount={novelList.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <NovelTableRow
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
          )}
        </Box>

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
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, novelData?.total || 0)} of ${novelData?.total || 0} items`}
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 0 } }}>
            <Pagination 
              page={page + 1} 
              count={totalPages}
              onChange={handleChangePage}
              color="primary"
              siblingCount={isMobile ? 0 : 2}
              boundaryCount={isMobile ? 1 : 1}
              showFirstButton 
              showLastButton
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        </Box>
      </Card>
    </DashboardContent>
  );
}

