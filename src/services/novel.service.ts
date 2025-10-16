import type { INovelModel, IListNovelQuery, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class NovelService {
    static getListNovel = async (query?: IListNovelQuery) => {
        const response = await api.get<IApiResponsePage<INovelModel>>(API_PATH_CONFIG.NOVEL, { params: query });
        return response.data;
    }

    static disableNovel = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.NOVEL_DISABLE, { ids });
        return response.data;
    }

    static enableNovel = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.NOVEL_ENABLE, { ids });
        return response.data;
    }

    static resetImage = async (ids: string[]) => {
        const response = await api.put(API_PATH_CONFIG.NOVEL_RESET_IMAGE, { ids });
        return response.data;
    }
    
}

