import type { IUserModel, IListUserQuery, IApiResponsePage, IApiResponse } from "src/types";
import type { IAdminUserDetailModel } from "@src/types/user.type";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class UserService {
  static getListUser = async (query?: IListUserQuery) => {
    const response = await api.get<IApiResponsePage<IUserModel>>(API_PATH_CONFIG.USER, { params: query });
    return response.data;
  }

  static updateCoin = async (userId: string, coin: number) => {
    const url = API_PATH_CONFIG.USER_UPDATE_COIN.replace(':id', userId);
    const response = await api.put(url, { coin });
    return response.data;
  }

  static updatePassword = async (userId: string, newPassword: string) => {
    const url = API_PATH_CONFIG.USER_UPDATE_PASSWORD.replace(':id', userId);
    const response = await api.put(url, { newPassword });
    return response.data;
  }

  static getUserById = async (userId: string) => {
    const response = await api.get<IApiResponse<IAdminUserDetailModel>>(
      `${API_PATH_CONFIG.USER}/${userId}`
    );
    return response.data;
  }

  static disableUser = async (userId: string, isDisabled: boolean) => {
    const url = API_PATH_CONFIG.USER_DISABLE.replace(':id', userId);
    const response = await api.put(url, { isDisabled });
    return response.data;
  }
}

