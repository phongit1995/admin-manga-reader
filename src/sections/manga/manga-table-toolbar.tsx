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

import { Iconify } from 'src/components/iconify';
import { ICategoryModel } from '@src/types/category.type';

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
};

export function MangaTableToolbar({ 
  numSelected, 
  filterName, 
  onFilterName, 
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange
}: MangaTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
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
        <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 750 }}>
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search manga..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ flexGrow: 1 }}
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