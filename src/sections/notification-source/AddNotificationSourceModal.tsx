import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  CircularProgress,
  Typography,
  Input
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import { Iconify } from "src/components/iconify";
import { NotificationSourceService } from 'src/services/notification-source.service';

const schema = yup.object({
  name: yup.string().required('Name is required')
}).required();

interface AddNotificationSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IFormInput {
  name: string;
}

export default function AddNotificationSourceModal({ open, onClose, onSuccess }: AddNotificationSourceModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (open) {
      reset({
        name: ''
      });
      setSelectedFile(null);
    }
  }, [open, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast.error('Please select a valid JSON file');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddNotificationSource = async (data: IFormInput) => {
    try {
      if (!selectedFile) {
        toast.error('Please select a Firebase service account JSON file');
        return;
      }

      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('file', selectedFile);
      
      await NotificationSourceService.createNotificationSource(formData);
      
      toast.success('Notification Source added successfully');
      reset();
      setSelectedFile(null);
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating notification source:', error);
      toast.error('Failed to add notification source');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setSelectedFile(null);
      onClose();
    }
  };

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
      <DialogTitle>Add New Notification Source</DialogTitle>
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
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Firebase Service Account Key
              </Typography>
              <Box 
                onClick={handleFileBoxClick}
                sx={{ 
                  border: '1px dashed',
                  borderColor: 'grey.400',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.neutral',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    borderColor: 'primary.main'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Input
                  inputRef={fileInputRef}
                  type="file"
                  sx={{ display: 'none' }}
                  onChange={handleFileChange}
                  inputProps={{
                    accept: 'application/json'
                  }}
                />
                <Stack spacing={2} alignItems="center">
                  <Iconify 
                    icon="solar:pen-bold" 
                    width={40}
                    height={40}
                    sx={{ color: selectedFile ? 'primary.main' : 'text.secondary' }}
                  />
                  {selectedFile ? (
                    <Box>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Click to upload Firebase service account JSON file
                    </Typography>
                  )}
                </Stack>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Upload a valid Firebase service account key JSON file
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit(handleAddNotificationSource)}
          disabled={loading || !selectedFile}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 