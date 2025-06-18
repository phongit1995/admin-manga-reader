import type { IApiPageQuery } from "./api.type";

export interface IListMangaQuery extends IApiPageQuery {
    genres?: string;
    type?: number;
    sort?: number;
    search?: string;
    status?: number;
}

export interface IMangaModel {
    _id: string;
    name: string;
    genres: string[];
    source: string;
    views: number;
    url: string;
    status: number;
    chapters: string[];
    chapterUpdateCount: number;
    enable: boolean;
    crawled: boolean;
    commentCount: number;
    devices: string[];
    userFollows: string[];
    ratingCount: number;
    ratingValue: number;
    totalChapters: number;
    chapterUpdate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    author: string;
    description: string;
    firstChapter: string;
    image: string;
    lastChapter: string;
}