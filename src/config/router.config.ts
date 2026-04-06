export enum ERouterConfig {
    // ── Content ──────────────────────────────────────────────────────────
    MANGA                = '/manga',
    MANGA_DETAIL         = '/manga/:id',
    NOVEL                = '/novel',
    NOVEL_DETAIL         = '/novel/:id',
    COMMENT_MANGA        = '/comment-manga',
    CATEGORY             = '/category',

    // ── User ─────────────────────────────────────────────────────────────
    USER                 = '/user',

    // ── Configuration ─────────────────────────────────────────────────────
    CONFIG_SOURCE        = '/config-source',
    APP_CONFIG           = '/app-config',
    PLATFORM_CONFIG      = '/platform-config',
    ANALYTICS_CONFIG     = '/analytics-config',
    IN_APP_PURCHASE      = '/in-app-purchase',

    // ── Notification ──────────────────────────────────────────────────────
    NOTIFICATION_SOURCE  = '/notification-source',
    APP_NOTIFICATION     = '/app-notification',
    SEND_NOTIFICATION    = '/send-notification',

    // ── Redeem Code ───────────────────────────────────────────────────────
    REDEEM_CODE          = '/redeem-code',

    // ── Auth ──────────────────────────────────────────────────────────────
    SIGN_IN              = '/sign-in',

    // ── Error ─────────────────────────────────────────────────────────────
    PAGE_404             = '/404',

    // ── Deprecated / Unused ───────────────────────────────────────────────
    // PRODUCT           = '/product',
    // BLOG              = '/blog',
    // SIGN_UP           = '/sign-up',
    // FORGOT_PASSWORD   = '/forgot-password',
    // RESET_PASSWORD    = '/reset-password',
}
