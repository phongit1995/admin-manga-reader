import { IApiPageQuery } from "./api.type";

export interface IAppConfigModel {
  _id: string;
  source?: string;
  showFakeApp?: boolean;
  imageResource?: string;
  readImageHeader?: object;
  imageHeader: object;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICreateAppConfigRequest {
  source?: string;
  showFakeApp?: boolean;
  imageResource?: string;
  readImageHeader?: object;
  imageHeader?: object;
}

export interface IListAppConfigQuery extends IApiPageQuery {}

export interface IUpdateAppConfigRequest extends Partial<ICreateAppConfigRequest> {}