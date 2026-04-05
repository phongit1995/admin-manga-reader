import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  CircularProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  Card,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import dayjs from 'dayjs';

import { IChapterModel } from '@src/types/chapter.type';
import { ChapterService } from '@src/services/chapter.service';
import { IResponsePage } from '@src/types';
import { Iconify } from 'src/components/iconify';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'views', label: 'Views', align: 'center' as const },
  { id: 'source', label: 'Source' },
  { id: 'images', label: 'Total Images', align: 'center' as const },
  { id: 'timeCreated', label: 'Date Added' },
];

interface MangaChapterTableProps {
  mangaId: string;
}

export default function MangaChapterTable({ mangaId }: MangaChapterTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [chapters, setChapters] = useState<IChapterModel[]>([]);
  const [chapterData, setChapterData] = useState<IResponsePage<IChapterModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  
  const fetchChapters = async () => {
    if (!mangaId) return;
    
    try {
      setLoading(true);
      const response = await ChapterService.getListChapterOfManga(mangaId, {
        page: page + 1,
        pageSize: rowsPerPage,
        sort: sortOrder
      });
      
      if (response.data) {
        setChapterData(response.data);
        setChapters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchChapters();
  }, [mangaId, page, rowsPerPage, sortOrder]);
  
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };
  
  const handleChangeSortOrder = (event: SelectChangeEvent) => {
    setSortOrder(Number(event.target.value) as 1 | -1);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const totalPages = Math.ceil((chapterData?.total || 0) / rowsPerPage);
  const emptyRows = chapters.length === 0;

  const handleCopyImages = (images: string[]) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(images));
      setShowCopyAlert(true);
    } catch (error) {
      console.error('Failed to copy images:', error);
    }
  };

  const handleCloseAlert = () => {
    setShowCopyAlert(false);
  };

  // Render each chapter as a card for mobile view
  const renderChapterCard = (chapter: IChapterModel) => (
    <Card 
      key={chapter._id} 
      sx={{ 
        p: 2, 
        mb: 2,
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {chapter.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(chapter.timeCreated)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Source: {chapter.source}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Views: {chapter.views.toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Images: {chapter.images.length}
          </Typography>
          <Tooltip title="Copy Image Array">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleCopyImages(chapter.images);
              }}
              sx={{ ml: 1 }}
            >
              <Iconify icon="solar:pen-bold" width={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Chapters
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order"
              value={sortOrder.toString()}
              label="Sort Order"
              onChange={handleChangeSortOrder}
            >
              <MenuItem value="1">Newest First</MenuItem>
              <MenuItem value="-1">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', minHeight: 200 }}>
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

        {isMobile ? (
          <Box sx={{ px: 2, pb: 2 }}>
            {chapters.length > 0 ? (
              chapters.map(chapter => renderChapterCard(chapter))
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1">
                  {loading ? 'Loading chapters...' : 'No chapters available'}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align || 'left'}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {chapters.length > 0 ? (
                  chapters.map((chapter) => (
                    <TableRow key={chapter._id} hover>
                      <TableCell>{chapter.name}</TableCell>
                      <TableCell align="center">{chapter.views.toLocaleString()}</TableCell>
                      <TableCell>{chapter.source}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {chapter.images.length}
                          <Tooltip title="Copy Image Array">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyImages(chapter.images);
                              }}
                              sx={{ ml: 1 }}
                            >
                              <Iconify icon="solar:pen-bold" width={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(chapter.timeCreated)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        {loading ? 'Loading chapters...' : 'No chapters available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
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
            {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, chapterData?.total || 0)} of ${chapterData?.total || 0} items`}
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

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Images array copied to clipboard!
        </Alert>
      </Snackbar>
    </Card>
  );
} 