import type { IApiPageQuery } from "./api.type";

export interface IListNotificationSourceQuery extends IApiPageQuery {}

export interface INotificationSourceModel {
    _id: string;
    name: string;
    clientEmail: string;
    privateKey: string;
    projectId: string;
    enable: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface INotificationSourceUpdateModel {
    name?: string;
    enable?: boolean;
}