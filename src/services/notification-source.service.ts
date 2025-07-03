import type { IApiResponse, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { INotificationSourceModel } from "@src/types/notification-source.type";

export class NotificationSourceService {
    static getListNotificationSource = async () => {
        const response = await api.get<IApiResponsePage<INotificationSourceModel>>(API_PATH_CONFIG.NOTIFICATION_SOURCE);
        return response.data;
    }

    static createNotificationSource = async () => {
        const response = await api.post<IApiResponse<INotificationSourceModel>>(API_PATH_CONFIG.NOTIFICATION_SOURCE);
        return response.data;
    }

    static deleteConfigSource = async (id: string) => {
        const response = await api.delete(API_PATH_CONFIG.NOTIFICATION_SOURCE + "/" + id);
        return response.data;
    }

}

