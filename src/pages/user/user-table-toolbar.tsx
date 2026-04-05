import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
};

export function UserTableToolbar({ 
  numSelected, 
  filterName, 
  onFilterName,
  onClearFilters,
}: UserTableToolbarProps) {
  const hasActiveFilters = !!filterName;
  
  return (
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
            {numSelected} user{numSelected > 1 ? 's' : ''} selected
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%', alignItems: 'center' }}>
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search users..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ 
              flexGrow: { xs: 1, md: 0 },
              width: { xs: '100%', md: '300px' },
              maxWidth: '100%'
            }}
          />
          
          <Button
            variant="outlined"
            color="primary"
            onClick={onClearFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            disabled={!hasActiveFilters}
            sx={{ minHeight: 56 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Toolbar>
  );
}
