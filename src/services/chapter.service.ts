import { api } from "@src/api/api";
import { API_PATH_CONFIG } from "@src/config/api-path.config";
import { IApiResponsePage } from "@src/types";
import { IChapterModel, IListChapterQuery } from "@src/types/chapter.type";

export class ChapterService {
    static getListChapterOfManga = async (mangaId: string, params?: IListChapterQuery) => {
        const response = await api.get<IApiResponsePage<IChapterModel>>(
            `${API_PATH_CONFIG.CHAPTER}/manga/${mangaId}`,
            { params }
        );
        return response.data;
    }
}

