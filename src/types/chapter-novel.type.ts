import type { IApiPageQuery } from './api.type';

export interface IChapterNovelModel {
  _id: string;
  novel: string;
  index: number;
  name?: string;
  title?: string;
  views: number;
  timeCreated: string;
}

export interface IListChapterNovelQuery extends IApiPageQuery {
  sort?: number;
}
