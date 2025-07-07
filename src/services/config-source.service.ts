import type { IApiResponse, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { IConfigSourceModel, IListConfigSourceQuery, ICreateConfigSourceRequest, IUpdateConfigSourceRequest } from "@src/types/config-source.type";

export class ConfigSourceService {
    static getListConfigSource = async (query?: IListConfigSourceQuery) => {
        const response = await api.get<IApiResponsePage<IConfigSourceModel>>(API_PATH_CONFIG.SOURCE_CONFIG, { params: query });
        return response.data;
    }

    static createConfigSource = async (body: ICreateConfigSourceRequest) => {
        const response = await api.post<IApiResponse<IConfigSourceModel>>(API_PATH_CONFIG.SOURCE_CONFIG, body);
        return response.data;
    }

    static updateConfigSource = async (id: string, body: IUpdateConfigSourceRequest) => {
        const response = await api.put<IApiResponse<IConfigSourceModel>>(API_PATH_CONFIG.SOURCE_CONFIG + "/" + id, body);
        return response.data;
    }

    static deleteConfigSource = async (id: string) => {
        const response = await api.delete(API_PATH_CONFIG.SOURCE_CONFIG + "/" + id);
        return response.data;
    }

}

