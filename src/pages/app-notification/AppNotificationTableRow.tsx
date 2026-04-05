import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Switch,
  Box,
  IconButton,
} from '@mui/material';
import { Iconify } from "src/components/iconify";
import { IAppNotificationModel } from "@src/types/app-notification.types";

interface AppNotificationTableRowProps {
  row: IAppNotificationModel;
  onEdit: (notification: IAppNotificationModel) => void;
  onDelete: (notification: IAppNotificationModel) => void;
  onToggleStatus: (id: string, field: 'enable' | 'isForce', value: boolean) => Promise<void>;
}

export default function AppNotificationTableRow({ 
  row, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: AppNotificationTableRowProps) {
  const [loadingEnable, setLoadingEnable] = useState(false);
  const [loadingForce, setLoadingForce] = useState(false);
  
  const handleToggleEnable = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    console.log(`Toggle Enable: ${row.enable} -> ${newValue}`);
    try {
      setLoadingEnable(true);
      await onToggleStatus(row._id || '', 'enable', newValue);
    } finally {
      setLoadingEnable(false);
    }
  };
  
  const handleToggleForce = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    console.log(`Toggle Force: ${row.isForce} -> ${newValue}`);
    try {
      setLoadingForce(true);
      await onToggleStatus(row._id || '', 'isForce', newValue);
    } finally {
      setLoadingForce(false);
    }
  };
  
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2">{row.title}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.message}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.packageId}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.platform}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.version}</Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="body2" 
          sx={{ 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}
        >
          {row.link}
        </Typography>
      </TableCell>
      
      <TableCell align="center">
        <Switch 
          checked={!!row.enable} 
          onChange={handleToggleEnable}
          disabled={loadingEnable}
        />
      </TableCell>
      
      <TableCell align="center">
        <Switch 
          checked={!!row.isForce} 
          onChange={handleToggleForce}
          disabled={loadingForce}
        />
      </TableCell>
      
      <TableCell>
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
      </TableCell>
      
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => onEdit(row)}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={() => onDelete(row)}>
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
} 