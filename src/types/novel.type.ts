import type { IApiPageQuery } from "./api.type";

export enum TYPE_SORT_NOVEL {
    'HOT_NOVEL' = 0,
    'CHAPTER_NEW' = 1,
    'TOP_RATE' = 2,
    'NUMBER_RATE' = 3,
}

export interface IListNovelQuery extends IApiPageQuery {
    genres?: string;
    type?: number;
    sort?: number;
    search?: string;
    status?: number;
    source?: string;
}

export interface INovelModel {
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

