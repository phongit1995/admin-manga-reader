// ─── Analytics Config ────────────────────────────────────────────────────────

export interface IAnalyticsConfigModel {
  _id: string;
  name: string;
  clientEmail: string;
  projectId: string;
  propertyId: string;
  index?: number;
  enable: boolean;
  createdAt: string;
}

/** POST /v1/admin/analytics/config — multipart/form-data */
export interface ICreateAnalyticsConfigRequest {
  name: string;
  propertyId: string;
  file: File;
}

/** PUT /v1/admin/analytics/config/{id} */
export interface IUpdateAnalyticsConfigRequest {
  name?: string;
  propertyId?: string;
  index?: number;
  enable: boolean;
}

// ─── Analytics Report ────────────────────────────────────────────────────────

export interface IAnalyticsReportQuery {
  startDate: string;
  endDate: string;
  /** Comma-separated GA4 metrics, e.g. "activeUsers,sessions" */
  metrics: string;
  /** Comma-separated GA4 dimensions, e.g. "date,country" */
  dimensions?: string;
}

// ─── Analytics Realtime ──────────────────────────────────────────────────────

export interface IAnalyticsRealtimeCountry {
  country: string;
  activeUsers: number;
}

export interface IAnalyticsRealtimeData {
  activeUsers30min: number;
  activeUsersToday: number;
  countries: IAnalyticsRealtimeCountry[];
}
