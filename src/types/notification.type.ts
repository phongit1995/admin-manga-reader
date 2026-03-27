export interface ISendNotificationRequest {
    topic?: string;
    deviceToken?: string;
    notificationSourceId?: string;
    title: string;
    body: string;
}
