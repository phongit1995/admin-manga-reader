import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { IAppConfigModel, ICreateAppConfigRequest, IListAppConfigQuery, IUpdateAppConfigRequest } from "@src/types/app-config.types";
import type { IApiResponsePage } from "src/types";

export default class AppConfigService {
    static async getAppConfigList(query?: IListAppConfigQuery) {
        const response = await api.get<IApiResponsePage<IAppConfigModel>>(API_PATH_CONFIG.APP_CONFIG, { params: query });
        return response.data;
    }

    static async createAppConfig(request: ICreateAppConfigRequest) {
        const response = await api.post<IAppConfigModel>(API_PATH_CONFIG.APP_CONFIG, request);
        return response.data;
    }

    static async updateAppConfig(id: string, request: IUpdateAppConfigRequest) {
        const response = await api.put<IAppConfigModel>(API_PATH_CONFIG.APP_CONFIG + "/" + id, request);
        return response.data;
    }

    static async deleteAppConfig(id: string) {
        const response = await api.delete<IAppConfigModel>(API_PATH_CONFIG.APP_CONFIG + "/" + id);
        return response.data;
    }
    
}

