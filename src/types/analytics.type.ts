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

export interface ICreateAnalyticsConfigRequest {
  name: string;
  propertyId: string;
  file: File;
}

export interface IUpdateAnalyticsConfigRequest {
  name?: string;
  propertyId?: string;
  index?: number;
  enable: boolean;
}

export interface IAnalyticsReportQuery {
  startDate: string;
  endDate: string;
  metrics: string;
  dimensions?: string;
}

export interface IAnalyticsRealtimeCountry {
  country: string;
  activeUsers: number;
}

export interface IAnalyticsRealtimeData {
  activeUsers30min: number;
  activeUsersToday: number;
  countries: IAnalyticsRealtimeCountry[];
}
