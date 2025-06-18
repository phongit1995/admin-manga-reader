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
  Checkbox,
  Stack,
  Avatar,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { ICategoryModel, ICreateCategoryRequest } from "@src/types/category.type";
import { CategoryService } from "@services/category-service";
import { Iconify } from "src/components/iconify";
import AddCategory from "./AddCategoryModal";

// Table components
interface CategoryTableHeadProps {
  headLabel: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: number;
    minWidth?: number;
  }[];
}

const CategoryTableHead = ({ headLabel }: CategoryTableHeadProps) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      
      {headLabel.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.align || 'left'}
          sx={{ width: headCell.width, minWidth: headCell.minWidth }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

interface CategoryTableRowProps {
  row: ICategoryModel;
  selected: boolean;
  onSelectRow: () => void;
}

const CategoryTableRow = ({ row, selected, onSelectRow }: CategoryTableRowProps) => (
  <TableRow hover selected={selected}>
    <TableCell padding="checkbox">
      <Checkbox checked={selected} onClick={onSelectRow} />
    </TableCell>
    
    <TableCell>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={row.name} src={row.image} />
        <Typography variant="subtitle2">{row.name}</Typography>
      </Stack>
    </TableCell>
    
    <TableCell>
      <Box
        component="img"
        src={row.image}
        alt={row.name}
        sx={{
          width: 64,
          height: 64,
          borderRadius: 1,
          objectFit: 'cover',
        }}
      />
    </TableCell>
    
    <TableCell align="center">{row.enable ? 'Yes' : 'No'}</TableCell>
    
    <TableCell>
      {new Date(row.createdAt).toLocaleDateString()}
    </TableCell>
    
    <TableCell>
      {new Date(row.updatedAt).toLocaleDateString()}
    </TableCell>

    <TableCell align="center">{row.index}</TableCell>
    
    <TableCell align="right">
      <IconButton>
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
      </IconButton>
    </TableCell>
  </TableRow>
);

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 280 },
  { id: 'image', label: 'Image', width: 100 },
  { id: 'enable', label: 'Enable', align: 'center' as const },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: 'index', label: 'Index', align: 'center' as const, width: 80 },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------

export const CategoryView = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<ICategoryModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchCategoryList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getListCategory();
      if (response && response.data && Array.isArray(response.data)) {
        setCategoryList(response.data);
      }
    } catch (error) {
      console.error('Error fetching category list:', error);
      showSnackbar('Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  const handleSelectRow = (id: string) => {
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
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddCategory = async (data: ICreateCategoryRequest) => {
    try {
      setLoading(true);
      // Ensure index is a number
      const categoryData = {
        ...data,
        index: Number(data.index)
      };

      const response = await CategoryService.createCategory(categoryData);
      
      if (response && response.status) {
        // Successfully added
        showSnackbar('Category added successfully', 'success');
        setOpenAddModal(false);
        // Refresh the list
        fetchCategoryList();
      } else {
        // API returned but with error status
        showSnackbar(response?.message || 'Failed to add category', 'error');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showSnackbar('Failed to add category', 'error');
    } finally {
      setLoading(false);
    }
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
          Categories
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={handleOpenAddModal}
        >
          Add Category
        </Button>
      </Box>

      <Card>
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
            <CategoryTableHead
              headLabel={TABLE_HEAD}
            />
            <TableBody>
              {categoryList.map((row) => (
                <CategoryTableRow
                  key={row._id}
                  row={row}
                  selected={selected.includes(row._id)}
                  onSelectRow={() => handleSelectRow(row._id)}
                />
              ))}

              {!categoryList.length && !loading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No Categories Found
                      </Typography>
                      <Typography variant="body2">
                        No categories available. Add a new category to get started.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddCategory 
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAdd={handleAddCategory}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
};