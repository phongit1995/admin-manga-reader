import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Switch,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Iconify } from "src/components/iconify";
import { IAppConfigModel } from "@src/types/app-config.types";

interface AppConfigTableRowProps {
  row: IAppConfigModel;
  onEdit: (config: IAppConfigModel) => void;
  onDelete: (config: IAppConfigModel) => void;
  onToggleStatus: (id: string, value: boolean) => Promise<void>;
}

export default function AppConfigTableRow({ 
  row, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: AppConfigTableRowProps) {
  const [loadingStatus, setLoadingStatus] = useState(false);
  
  const handleToggleStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    console.log(`Toggle Status: ${row.showFakeApp} -> ${newValue}`);
    try {
      setLoadingStatus(true);
      await onToggleStatus(row._id, newValue);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Function to display JSON objects in a readable format
  const formatJsonObject = (obj: object | undefined) => {
    if (!obj) return '-';
    try {
      return JSON.stringify(obj, null, 2).substring(0, 50) + '...';
    } catch (error) {
      return 'Invalid JSON';
    }
  };
  
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2">{row.source || '-'}</Typography>
      </TableCell>
      
      <TableCell align="center">
        <Switch 
          checked={!!row.showFakeApp} 
          onChange={handleToggleStatus}
          disabled={loadingStatus}
        />
      </TableCell>
      
      <TableCell>
        <Typography variant="body2">{row.imageResource || '-'}</Typography>
      </TableCell>
      
      <TableCell>
        <Tooltip title={row.readImageHeader ? JSON.stringify(row.readImageHeader, null, 2) : '-'}>
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 200, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {formatJsonObject(row.readImageHeader)}
          </Typography>
        </Tooltip>
      </TableCell>
      
      <TableCell>
        <Tooltip title={row.imageHeader ? JSON.stringify(row.imageHeader, null, 2) : '-'}>
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 200, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {formatJsonObject(row.imageHeader)}
          </Typography>
        </Tooltip>
      </TableCell>
      
      <TableCell>
        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
      </TableCell>
      
      <TableCell>
        {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '-'}
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