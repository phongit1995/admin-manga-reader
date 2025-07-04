import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { IAppNotificationModel, ICreateAppNotificationRequest, IListAppNotificationQuery, IUpdateAppNotificationRequest } from "@src/types/app-notification.types";
import type { IApiResponsePage } from "src/types";

export default class AppNotificationService {
    static async getAppNotificationList(query?: IListAppNotificationQuery) {
        const response = await api.get<IApiResponsePage<IAppNotificationModel>>(API_PATH_CONFIG.APP_NOTIFICATION, { params: query });
        return response.data;
    }

    static async createAppNotification(request: ICreateAppNotificationRequest) {
        const response = await api.post<IAppNotificationModel>(API_PATH_CONFIG.APP_NOTIFICATION, request);
        return response.data;
    }

    static async updateAppNotification(id: string, request: IUpdateAppNotificationRequest) {
        const response = await api.put<IAppNotificationModel>(API_PATH_CONFIG.APP_NOTIFICATION + "/" + id, request);
        return response.data;
    }

    static async deleteAppNotification(id: string) {
        const response = await api.delete<IAppNotificationModel>(API_PATH_CONFIG.APP_NOTIFICATION + "/" + id);
        return response.data;
    }
    
}

