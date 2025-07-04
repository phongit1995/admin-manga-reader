import type { IApiResponse } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { INotificationSourceModel, INotificationSourceUpdateModel } from "@src/types/notification-source.type";

export class NotificationSourceService {
    static getListNotificationSource = async (): Promise<INotificationSourceModel[]> => {
        try {
            const response = await api.get<INotificationSourceModel[]>(API_PATH_CONFIG.NOTIFICATION_SOURCE);
            return response.data;
        } catch  {   
            return [] as INotificationSourceModel[];
        }
    }

    static createNotificationSource = async (formData: FormData) => {
        const response = await api.post<IApiResponse<INotificationSourceModel>>(
            API_PATH_CONFIG.NOTIFICATION_SOURCE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    }

    static updateNotificationSource = async (id: string, data: INotificationSourceUpdateModel) => {
        const response = await api.put<IApiResponse<INotificationSourceModel>>(
            API_PATH_CONFIG.NOTIFICATION_SOURCE + "/" + id,
            data
        );
        return response.data;
    }

    static deleteNotificationSource = async (id: string) => {
        const response = await api.delete(API_PATH_CONFIG.NOTIFICATION_SOURCE + "/" + id);
        return response.data;
    }

}

