import { api } from '@src/api/api';
import { API_PATH_CONFIG } from '@src/config/api-path.config';
import type { IApiResponse, IApiResponsePage } from '@src/types';
import type {
  IAppUpdateModel,
  ICreateAppUpdateRequest,
  IUpdateAppUpdateRequest,
  IListAppUpdateQuery,
} from '@src/types/app-update.type';

export class AppUpdateService {
  static getList = async (params?: IListAppUpdateQuery) => {
    const response = await api.get<IApiResponsePage<IAppUpdateModel>>(
      API_PATH_CONFIG.APP_UPDATE,
      { params }
    );
    return response.data;
  };

  static create = async (body: ICreateAppUpdateRequest) => {
    const response = await api.post<IApiResponse<IAppUpdateModel>>(
      API_PATH_CONFIG.APP_UPDATE,
      body
    );
    return response.data;
  };

  static update = async (id: string, body: IUpdateAppUpdateRequest) => {
    const response = await api.put<IApiResponse<IAppUpdateModel>>(
      `${API_PATH_CONFIG.APP_UPDATE}/${id}`,
      body
    );
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await api.delete(`${API_PATH_CONFIG.APP_UPDATE}/${id}`);
    return response.data;
  };
}
