import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ICreateCategoryRequest } from '@src/types/category.type';

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
  onAdd: (data: ICreateCategoryRequest) => void;
}

export default function AddCategory({ open, onClose, onAdd }: AddCategoryProps) {
  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<ICreateCategoryRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      image: '',
      index: 0
    }
  });

  const onSubmit = (data: ICreateCategoryRequest) => {
    onAdd(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
