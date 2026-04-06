import { api } from '@src/api/api';
import { API_PATH_CONFIG } from '@src/config/api-path.config';
import type { IApiResponse, IApiResponsePage } from '@src/types';
import type {
  ICommentMangaModel,
  IListCommentMangaQuery,
  IToggleCommentRequest,
} from '@src/types/comment-manga.type';

export class CommentMangaService {
  static getList = async (params?: IListCommentMangaQuery) => {
    const response = await api.get<IApiResponsePage<ICommentMangaModel>>(
      API_PATH_CONFIG.COMMENT_MANGA,
      { params }
    );
    return response.data;
  };

  static getById = async (id: string) => {
    const response = await api.get<IApiResponse<ICommentMangaModel>>(
      `${API_PATH_CONFIG.COMMENT_MANGA}/${id}`
    );
    return response.data;
  };

  static getReplies = async (id: string, params?: { page: number; pageSize: number }) => {
    const response = await api.get<IApiResponsePage<ICommentMangaModel>>(
      `${API_PATH_CONFIG.COMMENT_MANGA}/${id}/replies`,
      { params }
    );
    return response.data;
  };

  static toggleEnable = async (id: string, body: IToggleCommentRequest) => {
    const response = await api.put<IApiResponse<ICommentMangaModel>>(
      `${API_PATH_CONFIG.COMMENT_MANGA}/${id}/toggle`,
      body
    );
    return response.data;
  };
}
