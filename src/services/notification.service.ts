import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { ISendNotificationRequest } from "@src/types/notification.type";

export class NotificationService {
    static sendNotification = async (body: ISendNotificationRequest) => {
        const response = await api.post(API_PATH_CONFIG.NOTIFICATION_SEND, body);
        return response.data;
    }
}
