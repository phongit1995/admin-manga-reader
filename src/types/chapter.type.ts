import { IApiPageQuery } from "./api.type";

export interface IListChapterQuery extends IApiPageQuery {
    sort?: number;
}

export interface IChapterModel {
    _id: string;
    manga: string;
    index: number;
    name: string;
    url: string;
    commentCount: number;
    images: string[];
    views: number;
    source: string;
    timeCreated: string;
    after: string;
}
