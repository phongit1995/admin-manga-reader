import type { IApiPageQuery } from "./api.type";

export interface IListUserQuery extends IApiPageQuery {
  search?: string;
}

export interface IUserModel {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  gender: number;
  coin: number;
  statusUpdateInfo: boolean;
  isVip: boolean;
  vipTime: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDisableUserRequest {
  isDisabled: boolean;
}

export interface IAdminUserDetailModel {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isVip: boolean;
  vipTime?: string;
  coin: number;
  bio?: string;
  enable: boolean;
  deviceToken: string[];
  createdAt: string;
}

