import type { IUserModel, IResponsePage } from "src/types";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { UserService } from "@src/services/user.service";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Stack,
  Pagination,
  useMediaQuery,
  useTheme,
  Paper,
  Chip,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { LoadingOverlay } from "@components/loading-overlay";

import { TableEmptyRows, TableNoData, CommonTableHead } from '@components/table';

import { UserTableRow } from "./user-table-row";
import { UserTableToolbar } from "./user-table-toolbar";
import { UserChangeCoinModal } from "./UserChangeCoinModal";
import { UserChangePasswordModal } from "./UserChangePasswordModal";

const TABLE_HEAD = [
  { id: 'username', label: 'Username', width: 250 },
  { id: 'email', label: 'Email', width: 220 },
  { id: 'gender', label: 'Gender', align: 'center' as const },
  { id: 'coin', label: 'Coins', align: 'center' as const },
  { id: 'createdAt', label: 'Joined Date', align: 'center' as const },
  { id: '', label: '' },
];

export default function UserView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [userList, setUserList] = useState<IUserModel[]>([]);
  const [userData, setUserData] = useState<IResponsePage<IUserModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [changeCoinModal, setChangeCoinModal] = useState<{ open: boolean; user: IUserModel | null }>({
    open: false,
    user: null,
  });

  const [changePasswordModal, setChangePasswordModal] = useState<{ open: boolean; user: IUserModel | null }>({
    open: false,
    user: null,
  });

  const [viewDetailModal, setViewDetailModal] = useState<{ open: boolean; user: IUserModel | null }>({
    open: false,
    user: null,
  });

  const fetchUserList = useCallback(async (currentPage: number, pageSize: number) => {
    try {
      setLoading(true);
      
      const response = await UserService.getListUser({ 
        page: currentPage + 1,
        pageSize,
        search: filterName || undefined,
      });
      
      if (response.data) {
        setUserData(response.data);
        setUserList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      toast.error('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  }, [filterName]);

  useEffect(() => {
    fetchUserList(page, rowsPerPage);
  }, [fetchUserList, page, rowsPerPage]);

  const handleSelectAllClick = useCallback((checked: boolean) => {
    if (checked) {
      const newSelected = userList.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [userList]);

  const handleClick = useCallback((id: string) => {
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
  }, [selected]);

  const handleFilterByName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  }, []);

  const handleOpenChangeCoin = useCallback((user: IUserModel) => {
    setChangeCoinModal({ open: true, user });
  }, []);

  const handleCloseChangeCoin = useCallback(() => {
    setChangeCoinModal({ open: false, user: null });
  }, []);

  const handleOpenChangePassword = useCallback((user: IUserModel) => {
    setChangePasswordModal({ open: true, user });
  }, []);

  const handleCloseChangePassword = useCallback(() => {
    setChangePasswordModal({ open: false, user: null });
  }, []);

  const handleViewDetail = useCallback((user: IUserModel) => {
    setViewDetailModal({ open: true, user });
  }, []);

  const handleCloseViewDetail = useCallback(() => {
    setViewDetailModal({ open: false, user: null });
  }, []);

  const handleUpdateCoin = useCallback(async (userId: string, newCoin: number) => {
    try {
      await UserService.updateCoin(userId, newCoin);
      toast.success('User coins updated successfully');
      fetchUserList(page, rowsPerPage);
    } catch (error: any) {
      console.error('Error updating coin:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update coins';
      toast.error(errorMessage);
    }
  }, [page, rowsPerPage, fetchUserList]);

  const handleUpdatePassword = useCallback(async (userId: string, newPassword: string) => {
    try {
      await UserService.updatePassword(userId, newPassword);
      toast.success('User password updated successfully');
    } catch (error: any) {
      console.error('Error updating password:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage);
    }
  }, []);

  const dataFiltered = userList;
  const notFound = !dataFiltered.length && !!filterName;
  const emptyRowsCount = userList.length === 0 ? rowsPerPage : 0;
  const totalPages = Math.ceil((userData?.total || 0) / rowsPerPage);

  const getGenderLabel = (gender: number) => {
    switch(gender) {
      case 0:
        return 'Female';
      case 1:
        return 'Male';
      case 2:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const renderUserCard = (user: IUserModel) => {
    const isSelected = selected.includes(user._id);
    
    return (
      <Paper
        key={user._id}
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
          '&:hover': {
            boxShadow: 10,
          },
          mb: 2
        }}
        onClick={() => handleClick(user._id)}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar 
            src={user.avatar} 
            alt={user.username} 
            sx={{ width: 60, height: 60 }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {user.username}
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {user.email}
            </Typography>
            
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  size="small"
                  label={getGenderLabel(user.gender)} 
                  color="default"
                  variant="outlined"
                />
                <Chip 
                  size="small"
                  label={user.isVip ? 'VIP' : 'Free'} 
                  color={user.isVip ? 'warning' : 'default'}
                />
                <Chip 
                  size="small"
                  label={`${user.coin} coins`} 
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Joined: {dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}
                </Typography>
                {(user.isVip || (user.vipTime && new Date(user.vipTime) > new Date())) && (
                  <Typography variant="caption" color="warning.main">
                    VIP until: {dayjs(user.vipTime).format('DD/MM/YYYY')}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Paper>
    );
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
          User Management
        </Typography>
      </Box>

      <Card>
        <UserTableToolbar 
          numSelected={selected.length} 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          onClearFilters={handleClearFilters}
        />

        <Box sx={{ position: 'relative', minHeight: 200 }}>
          <LoadingOverlay loading={loading} />
          
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              {dataFiltered.length > 0 ? (
                dataFiltered.map((user) => renderUserCard(user))
              ) : (
                <Box>
                  {notFound ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h6">No results found</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        No results found for &nbsp;
                        <strong>&quot;{filterName}&quot;</strong>.
                        <br /> Try checking for typos or using complete words.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h6">No users found</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        No users available with the current filters.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <CommonTableHead
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <UserTableRow
                      key={row._id}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => handleClick(row._id)}
                      onChangeCoin={() => handleOpenChangeCoin(row)}
                      onChangePassword={() => handleOpenChangePassword(row)}
                      onViewDetail={() => handleViewDetail(row)}
                    />
                  ))}

                  {emptyRowsCount > 0 && <TableEmptyRows height={68} emptyRows={emptyRowsCount} />}

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" component="span">
              {`${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, userData?.total || 0)} of ${userData?.total || 0} users`}
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 0 } }}>
            <Pagination 
              page={page + 1} 
              count={totalPages}
              onChange={handleChangePage}
              color="primary"
              siblingCount={isMobile ? 0 : 2}
              boundaryCount={isMobile ? 1 : 1}
              showFirstButton 
              showLastButton
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        </Box>
      </Card>

      <UserChangeCoinModal
        open={changeCoinModal.open}
        user={changeCoinModal.user}
        onClose={handleCloseChangeCoin}
        onConfirm={handleUpdateCoin}
      />

      <UserChangePasswordModal
        open={changePasswordModal.open}
        user={changePasswordModal.user}
        onClose={handleCloseChangePassword}
        onConfirm={handleUpdatePassword}
      />

      {/* View Detail Modal */}
      <Dialog
        open={viewDetailModal.open}
        onClose={handleCloseViewDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>User Detail</DialogTitle>
        <DialogContent>
          {viewDetailModal.user && (() => {
            const user = viewDetailModal.user!;
            const isVipActive = user.isVip || (user.vipTime && new Date(user.vipTime) > new Date());
            return (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      isVipActive ? (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: '#FFB300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #fff',
                            fontSize: 12,
                          }}
                        >
                          👑
                        </Box>
                      ) : null
                    }
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.username}
                      sx={{
                        width: 64,
                        height: 64,
                        ...(isVipActive && {
                          border: '3px solid #FFB300',
                          boxShadow: '0 0 12px rgba(255, 179, 0, 0.5)',
                        }),
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="h6">{user.username}</Typography>
                    {isVipActive && (
                      <Chip label="VIP" size="small" sx={{ bgcolor: '#FFB300', color: '#fff', fontWeight: 'bold' }} />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight="bold">{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body2">{user.gender === 1 ? 'Male' : user.gender === 0 ? 'Female' : 'Other'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Coins</Typography>
                    <Chip label={user.coin} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">VIP Status</Typography>
                    <Typography variant="body2" fontWeight="bold" color={isVipActive ? 'warning.main' : 'text.secondary'}>
                      {isVipActive ? 'VIP Active' : 'Free'}
                    </Typography>
                  </Box>
                  {isVipActive && user.vipTime && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">VIP Expires</Typography>
                      <Typography variant="body2" color="warning.main">
                        {dayjs(user.vipTime).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Joined Date</Typography>
                    <Typography variant="body2">{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Updated At</Typography>
                    <Typography variant="body2">{dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">User ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>{user._id}</Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

