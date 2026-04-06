import { useEffect, useState, useCallback, Fragment } from 'react';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Avatar,
  Stack,
  Chip,
  Switch,
  Pagination,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Tooltip,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CommonTableHead, TableNoData } from '@components/table';
import { LoadingOverlay } from '@components/loading-overlay';
import { CommentMangaService } from '@src/services/comment-manga.service';

import type { ICommentMangaModel } from '@src/types/comment-manga.type';
import type { IResponsePage } from '@src/types';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User', width: 180 },
  { id: 'content', label: 'Content', width: 320 },
  { id: 'manga', label: 'Manga', width: 200 },
  { id: 'source', label: 'Source' },
  { id: 'likes', label: 'Likes', align: 'center' as const, width: 80 },
  { id: 'replies', label: 'Replies', align: 'center' as const, width: 80 },
  { id: 'enable', label: 'Enable', align: 'center' as const, width: 90 },
  { id: 'createdAt', label: 'Date', width: 130 },
  { id: 'actions', label: '', width: 50 },
];

// ─── Row Component ──────────────────────────────────────────────────────────

function CommentRow({
  row,
  onToggleEnable,
  onViewReplies,
}: {
  row: ICommentMangaModel;
  onToggleEnable: (id: string, enable: boolean) => Promise<void>;
  onViewReplies: (comment: ICommentMangaModel) => void;
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setToggling(true);
      await onToggleEnable(row._id, event.target.checked);
    } finally {
      setToggling(false);
    }
  };

  return (
    <TableRow hover sx={!row.enable ? { opacity: 0.5 } : undefined}>
      {/* User */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={row.user?.avatar}
            alt={row.user?.username}
            sx={{ width: 32, height: 32 }}
          >
            {row.user?.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 130 }}>
              {row.user?.username || 'Unknown'}
            </Typography>
            {row.user?.isVip && (
              <Chip label="VIP" size="small" color="warning" sx={{ height: 18, fontSize: 10 }} />
            )}
          </Box>
        </Stack>
      </TableCell>

      {/* Content */}
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 300,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {row.content}
        </Typography>
        {row.parentComment && (
          <Chip label="Reply" size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: 10 }} />
        )}
      </TableCell>

      {/* Manga */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={row.manga?.image}
            alt={row.manga?.name}
            variant="rounded"
            sx={{ width: 36, height: 48 }}
          />
          <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
            {row.manga?.name || 'N/A'}
          </Typography>
        </Stack>
      </TableCell>

      {/* Source */}
      <TableCell>
        <Chip label={row.source} size="small" variant="outlined" />
      </TableCell>

      {/* Likes */}
      <TableCell align="center">
        <Typography variant="body2">{row.likeCount}</Typography>
      </TableCell>

      {/* Replies */}
      <TableCell align="center">
        <Typography variant="body2">{row.replyCount}</Typography>
      </TableCell>

      {/* Enable */}
      <TableCell align="center">
        <Switch
          checked={row.enable}
          onChange={handleToggle}
          disabled={toggling}
          size="small"
        />
      </TableCell>

      {/* Date */}
      <TableCell>
        <Typography variant="caption" color="text.secondary">
          {dayjs(row.createdAt).format('DD/MM/YYYY')}
        </Typography>
        <br />
        <Typography variant="caption" color="text.disabled">
          {dayjs(row.createdAt).format('HH:mm')}
        </Typography>
      </TableCell>

      {/* Actions */}
      <TableCell align="center">
        {row.replyCount > 0 && (
          <Tooltip title="View replies">
            <IconButton size="small" onClick={() => onViewReplies(row)}>
              <Iconify icon="solar:chat-round-dots-bold" width={18} />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}

// ─── Replies Inline Panel ───────────────────────────────────────────────────

function RepliesPanel({
  parentComment,
  onClose,
  onToggleEnable,
}: {
  parentComment: ICommentMangaModel;
  onClose: () => void;
  onToggleEnable: (id: string, enable: boolean) => Promise<void>;
}) {
  const [replies, setReplies] = useState<ICommentMangaModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setLoading(true);
        const response = await CommentMangaService.getReplies(parentComment._id, {
          page: 1,
          pageSize: 50,
        });
        if (response?.data) {
          setReplies(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching replies:', error);
        toast.error('Failed to fetch replies');
      } finally {
        setLoading(false);
      }
    };
    fetchReplies();
  }, [parentComment._id]);

  return (
    <TableRow>
      <TableCell colSpan={9} sx={{ p: 0, borderBottom: 'none' }}>
        <Collapse in timeout="auto">
          <Box sx={{ px: 4, py: 2, bgcolor: 'action.hover' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2">
                Replies to &quot;{parentComment.content.slice(0, 50)}
                {parentComment.content.length > 50 ? '...' : ''}&quot;
              </Typography>
              <IconButton size="small" onClick={onClose}>
                <Iconify icon="mingcute:close-line" width={18} />
              </IconButton>
            </Stack>

            <Divider sx={{ mb: 1.5 }} />

            {loading ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Loading replies...
              </Typography>
            ) : replies.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No replies found.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {replies.map((reply) => (
                  <ReplyItem key={reply._id} reply={reply} onToggleEnable={onToggleEnable} />
                ))}
              </Stack>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}

function ReplyItem({
  reply,
  onToggleEnable,
}: {
  reply: ICommentMangaModel;
  onToggleEnable: (id: string, enable: boolean) => Promise<void>;
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setToggling(true);
      await onToggleEnable(reply._id, event.target.checked);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={1.5}
      sx={{
        p: 1.5,
        borderRadius: 1,
        bgcolor: 'background.paper',
        opacity: reply.enable ? 1 : 0.5,
      }}
    >
      <Avatar src={reply.user?.avatar} sx={{ width: 28, height: 28 }}>
        {reply.user?.username?.charAt(0)?.toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" fontSize={13}>
            {reply.user?.username}
          </Typography>
          {reply.user?.isVip && (
            <Chip label="VIP" size="small" color="warning" sx={{ height: 16, fontSize: 9 }} />
          )}
          <Typography variant="caption" color="text.disabled">
            {dayjs(reply.createdAt).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 0.25 }}>
          {reply.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {reply.likeCount} likes
        </Typography>
      </Box>
      <Switch checked={reply.enable} onChange={handleToggle} disabled={toggling} size="small" />
    </Stack>
  );
}

// ─── Main View ──────────────────────────────────────────────────────────────

export default function CommentMangaView() {
  const [commentList, setCommentList] = useState<ICommentMangaModel[]>([]);
  const [commentData, setCommentData] = useState<IResponsePage<ICommentMangaModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');
  const [expandedComment, setExpandedComment] = useState<ICommentMangaModel | null>(null);

  const fetchComments = useCallback(
    async (currentPage: number, pageSize: number) => {
      try {
        setLoading(true);
        const response = await CommentMangaService.getList({
          page: currentPage + 1,
          pageSize,
        });

        if (response?.data) {
          setCommentData(response.data);
          setCommentList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchComments(page, rowsPerPage);
  }, [fetchComments, page, rowsPerPage]);

  const handleToggleEnable = useCallback(
    async (id: string, enable: boolean) => {
      try {
        await CommentMangaService.toggleEnable(id, { enable });
        toast.success(`Comment ${enable ? 'enabled' : 'disabled'} successfully`);
        fetchComments(page, rowsPerPage);
      } catch (error) {
        console.error('Error toggling comment:', error);
        toast.error('Failed to update comment status');
      }
    },
    [page, rowsPerPage, fetchComments]
  );

  const handleChangePage = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
    setExpandedComment(null);
  }, []);

  const handleViewReplies = useCallback((comment: ICommentMangaModel) => {
    setExpandedComment((prev) => (prev?._id === comment._id ? null : comment));
  }, []);

  const handleCloseReplies = useCallback(() => {
    setExpandedComment(null);
  }, []);

  // Client-side search filter (filter currently loaded page)
  const filtered = filterSearch
    ? commentList.filter(
        (c) =>
          c.content.toLowerCase().includes(filterSearch.toLowerCase()) ||
          c.user?.username?.toLowerCase().includes(filterSearch.toLowerCase()) ||
          c.manga?.name?.toLowerCase().includes(filterSearch.toLowerCase())
      )
    : commentList;

  const notFound = !filtered.length && !!filterSearch;
  const totalPages = Math.ceil((commentData?.total || 0) / rowsPerPage);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Manga Comments</Typography>
      </Box>

      <Card>
        {/* Toolbar */}
        <Toolbar
          sx={{
            height: 76,
            display: 'flex',
            justifyContent: 'space-between',
            p: (theme) => theme.spacing(0, 1, 0, 3),
          }}
        >
          <OutlinedInput
            fullWidth
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search by user, content, or manga..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 400 }}
          />
          <Typography variant="body2" color="text.secondary">
            {commentData?.total ?? 0} comments
          </Typography>
        </Toolbar>

        {/* Table */}
        <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 200 }}>
          <LoadingOverlay loading={loading} />
          <Table sx={{ minWidth: 960 }}>
            <CommonTableHead headLabel={TABLE_HEAD} />
            <TableBody>
              {filtered.map((row) => (
                <Fragment key={row._id}>
                  <CommentRow
                    row={row}
                    onToggleEnable={handleToggleEnable}
                    onViewReplies={handleViewReplies}
                  />
                  {expandedComment?._id === row._id && (
                    <RepliesPanel
                      parentComment={row}
                      onClose={handleCloseReplies}
                      onToggleEnable={handleToggleEnable}
                    />
                  )}
                </Fragment>
              ))}

              {!filtered.length && !loading && (
                notFound ? (
                  <TableNoData searchQuery={filterSearch} />
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          No Comments Found
                        </Typography>
                        <Typography variant="body2">No manga comments available.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
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
          <Typography variant="body2" component="span">
            {commentData
              ? `${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, commentData.total)} of ${commentData.total} items`
              : '0 items'}
          </Typography>

          <Pagination
            page={page + 1}
            count={totalPages}
            onChange={handleChangePage}
            color="primary"
            siblingCount={2}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        </Box>
      </Card>
    </DashboardContent>
  );
}
