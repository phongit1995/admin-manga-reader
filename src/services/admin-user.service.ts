import { api } from '@src/api/api';
import { API_PATH_CONFIG } from '@src/config/api-path.config';
import type { IApiResponse, IApiResponsePage } from '@src/types';
import type {
  IAdminUserModel,
  ICreateAdminUserRequest,
  IUpdateAdminUserRequest,
  IListAdminUserQuery,
} from '@src/types/admin-user.type';

export class AdminUserService {
  static getList = async (params?: IListAdminUserQuery) => {
    const response = await api.get<IApiResponsePage<IAdminUserModel>>(
      API_PATH_CONFIG.ADMIN_USER,
      { params }
    );
    return response.data;
  };

  static getById = async (id: string) => {
    const response = await api.get<IApiResponse<IAdminUserModel>>(
      `${API_PATH_CONFIG.ADMIN_USER}/${id}`
    );
    return response.data;
  };

  static create = async (body: ICreateAdminUserRequest) => {
    const response = await api.post<IApiResponse<IAdminUserModel>>(
      API_PATH_CONFIG.ADMIN_USER,
      body
    );
    return response.data;
  };

  static update = async (id: string, body: IUpdateAdminUserRequest) => {
    const response = await api.put<IApiResponse<IAdminUserModel>>(
      `${API_PATH_CONFIG.ADMIN_USER}/${id}`,
      body
    );
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await api.delete(`${API_PATH_CONFIG.ADMIN_USER}/${id}`);
    return response.data;
  };
}
