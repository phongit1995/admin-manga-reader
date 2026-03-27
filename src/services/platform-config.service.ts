import type { IApiResponse, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { IPlatformConfigModel, IListPlatformConfigQuery, ICreatePlatformConfigRequest, IUpdatePlatformConfigRequest } from "@src/types/platform-config.type";

export class PlatformConfigService {
    static getListPlatformConfig = async (query?: IListPlatformConfigQuery) => {
        const response = await api.get<IApiResponsePage<IPlatformConfigModel>>(API_PATH_CONFIG.PLATFORM_CONFIG, { params: query });
        return response.data;
    }

    static createPlatformConfig = async (body: ICreatePlatformConfigRequest) => {
        const response = await api.post<IApiResponse<IPlatformConfigModel>>(API_PATH_CONFIG.PLATFORM_CONFIG, body);
        return response.data;
    }

    static updatePlatformConfig = async (id: string, body: IUpdatePlatformConfigRequest) => {
        const response = await api.put<IApiResponse<IPlatformConfigModel>>(API_PATH_CONFIG.PLATFORM_CONFIG + "/" + id, body);
        return response.data;
    }
}
