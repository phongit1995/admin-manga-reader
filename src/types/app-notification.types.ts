import { IApiPageQuery } from "./api.type";

export interface IListAppNotificationQuery extends IApiPageQuery {
}

export interface IAppNotificationModel {
    _id?: string;
    title?: string;
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
    title?: string;
    message?: string;
    packageId?: string;
    platform?: string;
    version?: string;
    link?: string;
    enable?: boolean;
    isForce?: boolean;
}

export interface IUpdateAppNotificationRequest extends ICreateAppNotificationRequest {}
