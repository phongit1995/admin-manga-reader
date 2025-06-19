import type { IMangaModel, IListMangaQuery, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class MangaService {
    static getListManga = async (query?: IListMangaQuery) => {
        const response = await api.get<IApiResponsePage<IMangaModel>>(API_PATH_CONFIG.MANGA, { params: query });
        return response.data;
    }

    static disableManga = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.MANGA_DISABLE, { ids });
        return response.data;
    }

    static enableManga = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.MANGA_ENABLE, { ids });
        return response.data;
    }

    static resetImage = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.MANGA_RESET_IMAGE, { ids });
        return response.data;
    }
    
}

