export const API_PATH_CONFIG = {
    // Auth
    ADMIN_LOGIN: 'v1/admin/auth/login',
    
    // Manga
    MANGA: 'v1/admin/manga',
    MANGA_DISABLE: 'v1/admin/manga/disable',
    MANGA_ENABLE: 'v1/admin/manga/enable',
    MANGA_RESET_IMAGE: 'v1/admin/manga/reset-image',
    
    // Novel
    NOVEL: 'v1/admin/novel',
    NOVEL_DISABLE: 'v1/admin/novel/disable',
    NOVEL_ENABLE: 'v1/admin/novel/enable',
    
    // Others
    CATEGORY: 'v1/admin/category',
    CHAPTER: 'v1/admin/chapter',
    SOURCE_CONFIG: 'v1/admin/source-config',
    APP_CONFIG: 'v1/admin/app-config',
    IN_APP_PURCHASE: 'v1/admin/in-app-purchase',
    NOTIFICATION_SOURCE: 'v1/admin/notification-source',
    APP_NOTIFICATION: 'v1/admin/app-notification',
    USER: 'v1/admin/user',
    USER_UPDATE_COIN: 'v1/admin/user/:id/coin',
    USER_UPDATE_PASSWORD: 'v1/admin/user/:id/password',
    USER_DISABLE: 'v1/admin/user/:id/disable',
    STATISTICS_COMMON: 'v1/admin/statistics/common',

    // Platform Config
    PLATFORM_CONFIG: 'v1/admin/platform-config',

    // Notification
    NOTIFICATION_SEND: 'v1/admin/notification/send',

    // Redeem Code
    REDEEM_CODE_LIST: 'v1/admin/redeem-code/list',
    REDEEM_CODE_CREATE: 'v1/admin/redeem-code/create',
    REDEEM_CODE_BATCH_CREATE: 'v1/admin/redeem-code/batch-create',
    REDEEM_CODE_STATS: 'v1/admin/redeem-code/stats',
    REDEEM_CODE_DISABLE: 'v1/admin/redeem-code/disable',
    REDEEM_CODE_DEVICE_HISTORY: 'v1/admin/redeem-code/device',

    // Admin User Management
    ADMIN_USER: 'v1/admin/admin-user',

    // App Update
    APP_UPDATE: 'v1/admin/app-update',

    // Comment Manga
    COMMENT_MANGA: 'v1/admin/comment-manga',

    // Chapter Novel
    CHAPTER_NOVEL: 'v1/admin/chapter-novel',

    // Analytics
    ANALYTICS_CONFIG: 'v1/admin/analytics/config',
    ANALYTICS_REPORT: 'v1/admin/analytics/report',
    ANALYTICS_REALTIME: 'v1/admin/analytics/realtime',

}
