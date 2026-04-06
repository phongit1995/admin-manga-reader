import type { IApiPageQuery } from './api.type';

export type AppPlatform = 'android' | 'ios';

export interface IAppUpdateModel {
  _id: string;
  packageId: string;
  platform: AppPlatform;
  version: string;
  title?: string;
  message?: string;
  link?: string;
  isForce: boolean;
  enable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAppUpdateRequest {
  packageId: string;
  platform: AppPlatform;
  version: string;
  title?: string;
  message?: string;
  link?: string;
  isForce: boolean;
}

export interface IUpdateAppUpdateRequest {
  packageId?: string;
  platform?: AppPlatform;
  version?: string;
  title?: string;
  message?: string;
  link?: string;
  isForce?: boolean;
  enable?: boolean;
}

export interface IListAppUpdateQuery extends IApiPageQuery {}
