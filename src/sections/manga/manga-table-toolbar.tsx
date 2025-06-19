import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import { ICategoryModel } from '@src/types/category.type';
import { TYPE_SORT_MANGA } from '@src/types/manga.type';
import { IConfigSourceModel } from '@src/types/config-source.type';

// ----------------------------------------------------------------------

type MangaTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories?: ICategoryModel[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedStatus: number | '';
  onStatusChange: (status: number | '') => void;
  selectedSort: number;
  onSortChange: (sort: number) => void;
  sources?: IConfigSourceModel[];
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onClearFilters: () => void;
};

export function MangaTableToolbar({ 
  numSelected, 
  filterName, 
  onFilterName, 
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  sources = [],
  selectedSource,
  onSourceChange,
  onClearFilters
}: MangaTableToolbarProps) {
  const hasActiveFilters = !!(filterName || selectedCategory || selectedStatus !== '' || selectedSource);
  
  return (
    <Toolbar
      sx={{
        height: 'auto',
        padding: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'flex-start',
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search manga..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="source-select-label">Source</InputLabel>
            <Select
              labelId="source-select-label"
              id="source-select"
              value={selectedSource}
              label="Source"
              onChange={(e) => onSourceChange(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {sources.map((source) => (
                <MenuItem key={source._id} value={source.key}>
                  {source.key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Status"
              onChange={(e) => onStatusChange(e.target.value as number | '')}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value={0}>Ongoing</MenuItem>
              <MenuItem value={1}>Completed</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={selectedSort}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value as number)}
            >
              <MenuItem value={TYPE_SORT_MANGA.HOT_MANGA}>Hot Manga</MenuItem>
              <MenuItem value={TYPE_SORT_MANGA.CHAPTER_NEW}>Latest Updates</MenuItem>
              <MenuItem value={TYPE_SORT_MANGA.TOP_RATE}>Top Rated</MenuItem>
              <MenuItem value={TYPE_SORT_MANGA.NUMBER_RATE}>Most Rated</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={onClearFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            disabled={!hasActiveFilters}
            sx={{ alignSelf: 'center' }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
} 