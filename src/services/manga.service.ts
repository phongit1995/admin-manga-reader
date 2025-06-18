import type { IMangaModel, IListMangaQuery, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class MangaService {
    static getListManga = async (query?: IListMangaQuery) => {
        const response = await api.get<IApiResponsePage<IMangaModel>>(API_PATH_CONFIG.MANGA, { params: query });
        return response.data;
    }
}

