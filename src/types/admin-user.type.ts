import type { IApiPageQuery } from './api.type';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface IAdminUserModel {
  _id: string;
  username: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginIp?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface ICreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface IUpdateAdminUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface IListAdminUserQuery extends IApiPageQuery {}
