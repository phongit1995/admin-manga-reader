import { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { Iconify } from 'src/components/iconify';
import { ICategoryModel } from '@src/types/category.type';
import { TYPE_SORT_NOVEL } from '@src/types/novel.type';
import { ConfirmActionModal } from '@components/confirm-action-modal';
import type { ConfirmActionConfig } from '@components/confirm-action-modal';

const NOVEL_ACTIONS: Record<string, ConfirmActionConfig> = {
  disable: {
    key: 'disable',
    label: 'Disable',
    title: 'Disable Selected Novel',
    actionText: 'disable',
    color: 'error',
    icon: 'solar:eye-closed-bold',
  },
  enable: {
    key: 'enable',
    label: 'Enable',
    title: 'Enable Selected Novel',
    actionText: 'enable',
    color: 'success',
    icon: 'solar:eye-bold',
  },
  resetImages: {
    key: 'resetImages',
    label: 'Reset Images',
    title: 'Reset Images for Selected Novel',
    actionText: 'reset images for',
    color: 'info',
    icon: 'solar:restart-bold',
    warning: 'This will trigger a new crawl process to update all images.',
  },
};

type NovelTableToolbarProps = {
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
  onClearFilters: () => void;
  onDisable?: (ids: string[]) => Promise<void>;
  onEnable?: (ids: string[]) => Promise<void>;
  onResetImages?: (ids: string[]) => Promise<void>;
  selectedIds: string[];
};

export function NovelTableToolbar({ 
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
  onClearFilters,
  onDisable,
  onEnable,
  onResetImages,
  selectedIds
}: NovelTableToolbarProps) {
  const hasActiveFilters = !!(filterName || selectedCategory || selectedStatus !== '');
  
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<ConfirmActionConfig | null>(null);

  const handleOpenModal = (actionKey: string) => {
    setAction(NOVEL_ACTIONS[actionKey]);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAction(null);
  };

  const handleConfirmAction = async () => {
    if (!action) return;
    
    switch (action.key) {
      case 'disable':
        if (onDisable) await onDisable(selectedIds);
        break;
      case 'enable':
        if (onEnable) await onEnable(selectedIds);
        break;
      case 'resetImages':
        if (onResetImages) await onResetImages(selectedIds);
        break;
      default:
        break;
    }
  };
  
  return (
    <>
    <Toolbar
      sx={{
        height: 'auto',
        padding: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Typography component="div" variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="solar:check-circle-bold" sx={{ mr: 1 }} />
            {numSelected} novel selected
          </Typography>
          <ButtonGroup variant="contained" aria-label="Action button group">
            <Button 
              color="error" 
              startIcon={<Iconify icon="solar:eye-closed-bold" />}
              onClick={() => handleOpenModal('disable')}
            >
              Disable
            </Button>
            <Button 
              color="success" 
              startIcon={<Iconify icon="solar:eye-bold" />}
              onClick={() => handleOpenModal('enable')}
            >
              Enable
            </Button>
            <Button 
              color="info" 
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={() => handleOpenModal('resetImages')}
            >
              Reset Images
            </Button>
          </ButtonGroup>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%' }}>
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search novel..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ 
              flexGrow: { xs: 1, md: 0 },
              width: { xs: '100%', md: '180px' },
              maxWidth: '100%'
            }}
          />
          
          <FormControl sx={{ minWidth: 150, flexGrow: { xs: 1, md: 0 } }}>
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
          
          <FormControl sx={{ minWidth: 150, flexGrow: { xs: 1, md: 0 } }}>
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
          
          <FormControl sx={{ minWidth: 150, flexGrow: { xs: 1, md: 0 } }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={selectedSort}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value as number)}
            >
              <MenuItem value={TYPE_SORT_NOVEL.HOT_NOVEL}>Hot Novel</MenuItem>
              <MenuItem value={TYPE_SORT_NOVEL.CHAPTER_NEW}>Latest Updates</MenuItem>
              <MenuItem value={TYPE_SORT_NOVEL.TOP_RATE}>Top Rated</MenuItem>
              <MenuItem value={TYPE_SORT_NOVEL.NUMBER_RATE}>Most Rated</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={onClearFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            disabled={!hasActiveFilters}
            sx={{ alignSelf: 'center', minHeight: 56 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Toolbar>

    <ConfirmActionModal
      open={openModal}
      action={action}
      numSelected={numSelected}
      entityName="novel"
      onClose={handleCloseModal}
      onConfirm={handleConfirmAction}
    />
    </>
  );
}

