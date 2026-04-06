import { api } from '@src/api/api';
import { API_PATH_CONFIG } from '@src/config/api-path.config';
import type { IApiResponsePage } from '@src/types';
import type {
  IChapterNovelModel,
  IListChapterNovelQuery,
} from '@src/types/chapter-novel.type';

export class ChapterNovelService {
  static getListByNovelId = async (novelId: string, params?: IListChapterNovelQuery) => {
    const response = await api.get<IApiResponsePage<IChapterNovelModel>>(
      `${API_PATH_CONFIG.CHAPTER_NOVEL}/novel/${novelId}`,
      { params }
    );
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await api.delete(`${API_PATH_CONFIG.CHAPTER_NOVEL}/${id}`);
    return response.data;
  };
}
