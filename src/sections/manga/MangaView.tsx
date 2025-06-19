import type { IMangaModel, IResponsePage, IApiResponse } from "src/types";
import { TYPE_SORT_MANGA } from "src/types";
import type { ICategoryModel } from "@src/types/category.type";
import type { IConfigSourceModel } from "@src/types/config-source.type";

import { useEffect, useState, useCallback } from "react";
import dayjs from 'dayjs';

import { MangaService } from "@src/services/manga.service";
import { CategoryService } from "@src/services/category.service";
import { ConfigSourceService } from "@src/services/config-source.service";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  CircularProgress,
  Stack,
  Pagination,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { TableEmptyRows } from "src/sections/user/table-empty-rows";
import { TableNoData } from "src/sections/user/table-no-data";

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
  { id: 'source', label: 'Source' },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export default function MangaView() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSort, setSelectedSort] = useState<number>(TYPE_SORT_MANGA.CHAPTER_NEW);
  const [mangaList, setMangaList] = useState<IMangaModel[]>([]);
  const [mangaData, setMangaData] = useState<IResponsePage<IMangaModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategoryModel[]>([]);
  const [sources, setSources] = useState<IConfigSourceModel[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch categories and sources
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getListCategory();
        if (response && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSources = async () => {
      try {
        const response = await ConfigSourceService.getListConfigSource({ page: 1, pageSize: 1000 });
        if (response && response.data) {
          setSources(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    };

    fetchCategories();
    fetchSources();
  }, []);

  const fetchMangaList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      
      let selectedCategoryName = '';
      if (selectedCategory) {
        const category = categories.find(cat => cat._id === selectedCategory);
        if (category) {
          selectedCategoryName = category.name;
        }
      }
      
      const response = await MangaService.getListManga({ 
        page: currentPage + 1,
        pageSize,
        search: filterName || undefined,
        genres: selectedCategoryName || undefined,
        status: selectedStatus !== '' ? selectedStatus : undefined,
        source: selectedSource || undefined,
        sort: selectedSort,
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
  }, [filterName, selectedCategory, categories, selectedStatus, selectedSource, selectedSort]);

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

  const handleSourceChange = useCallback((source: string) => {
    setSelectedSource(source);
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
    setSelectedSource('');
    setSelectedSort(TYPE_SORT_MANGA.CHAPTER_NEW);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  }, []);

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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
          sources={sources}
          selectedSource={selectedSource}
          onSourceChange={handleSourceChange}
          onClearFilters={handleClearFilters}
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
          <Box>
            <Typography variant="body2" component="span">
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, mangaData?.total || 0)} of ${mangaData?.total || 0} items`}
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
    </DashboardContent>
  );
}
