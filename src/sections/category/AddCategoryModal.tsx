import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICreateCategoryRequest } from '@src/types/category.type';
import { CategoryService } from "@services/category-service";
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

// Define validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  image: yup.string().required('Image URL is required'),
  index: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .typeError('Index must be a number')
    .required('Index is required')
    .min(0, 'Index must be a positive number')
}).required();

interface AddCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh the category list
}

export default function AddCategory({ open, onClose, onSuccess }: AddCategoryProps) {
  const [loading, setLoading] = useState(false);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<ICreateCategoryRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      image: '',
      index: 0
    },
    mode: 'onChange' // Validate on change for better UX
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        image: '',
        index: 0
      });
    }
  }, [open, reset]);

  const handleAddCategory = async (data: ICreateCategoryRequest) => {
    console.log('data', data);
    try {
      setLoading(true);
      const categoryData = {
        ...data,
        index: Number(data.index)
      };

      const response = await CategoryService.createCategory(categoryData);
      if (response && response.data) {
        reset();
        onClose(); 
        onSuccess(); 
        toast.success('Category added successfully');
      } else {
        toast.error(response?.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  // Only close if not loading
  const handleDialogClose = (event: any, reason: string) => {
    if (reason !== 'backdropClick' || !loading) {
      handleClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose} 
      fullWidth 
      maxWidth="sm"
      disableEscapeKeyDown={loading}

    >
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ pt: 2 }} noValidate>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Image URL"
                  error={!!errors.image}
                  helperText={errors.image?.message}
                  disabled={loading}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="index"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Index"
                  type="number"
                  error={!!errors.index}
                  helperText={errors.index?.message}
                  InputProps={{ inputProps: { min: 0 } }}
                  disabled={loading}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit(handleAddCategory)}
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
