import type { IApiPageQuery } from "./api.type";

export interface IListCategoryQuery extends IApiPageQuery {
}

export interface ICategoryModel {
    index: number;
    _id: string;
    enable: boolean;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}