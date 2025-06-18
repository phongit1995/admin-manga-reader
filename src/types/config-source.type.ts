import type { IApiPageQuery } from "./api.type";

export interface IListConfigSourceQuery extends IApiPageQuery {}

export interface IConfigSourceModel {
    _id: string;
    name: string;
    key: string;
    enable: boolean;
    index: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    
}

export interface ICreateConfigSourceRequest {
    name: string;
    key: string;
    index: number;
    enable: boolean;
}