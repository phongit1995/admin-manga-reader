import type { IApiPageQuery } from './api.type';

export interface ICommentMangaUserInfo {
  _id: string;
  username: string;
  avatar: string;
  isVip: boolean;
  vipTime?: string;
}

export interface ICommentMangaInfo {
  _id: string;
  name: string;
  image: string;
  genres?: string[];
  views?: number;
  commentCount?: number;
}

export interface ICommentMangaModel {
  _id: string;
  content: string;
  enable: boolean;
  source: string;
  likes: string[];
  parentComment: string | null;
  replyCount: number;
  isVip: boolean;
  likeCount: number;
  numberOfReplies: number;
  isLikedByCurrentUser: boolean;
  manga: ICommentMangaInfo;
  user: ICommentMangaUserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface IListCommentMangaQuery extends IApiPageQuery {
  mangaId?: string;
  userId?: string;
  source?: string;
}

export interface IToggleCommentRequest {
  enable: boolean;
}
