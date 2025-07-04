import { IApiPageQuery } from "./api.type";

export interface IListAppNotificationQuery extends IApiPageQuery {
}

export interface IAppNotificationModel {
    _id?: string;
    message?: string;
    packageId?: string;
    platform?: string;
    version?: string;
    link?: string;
    enable?: boolean;
    isForce?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}


export interface ICreateAppNotificationRequest {
    message?: string;
    packageId?: string;
    platform?: string;
    version?: string;
    link?: string;
    enable?: boolean;
    isForce?: boolean;
}

export interface IUpdateAppNotificationRequest extends ICreateAppNotificationRequest {}
