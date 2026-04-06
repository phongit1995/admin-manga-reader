import { api } from '@src/api/api';
import { API_PATH_CONFIG } from '@src/config/api-path.config';
import type { IApiResponse } from '@src/types';
import type {
  IAnalyticsConfigModel,
  ICreateAnalyticsConfigRequest,
  IUpdateAnalyticsConfigRequest,
  IAnalyticsReportQuery,
  IAnalyticsRealtimeData,
} from '@src/types/analytics.type';

export class AnalyticsService {
  static getListConfig = async () => {
    const response = await api.get<IApiResponse<IAnalyticsConfigModel[]>>(
      API_PATH_CONFIG.ANALYTICS_CONFIG
    );
    return response.data;
  };

  static createConfig = async (body: ICreateAnalyticsConfigRequest) => {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('propertyId', body.propertyId);
    formData.append('file', body.file);

    const response = await api.post<IApiResponse<IAnalyticsConfigModel>>(
      API_PATH_CONFIG.ANALYTICS_CONFIG,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  };

  static updateConfig = async (id: string, body: IUpdateAnalyticsConfigRequest) => {
    const response = await api.put<IApiResponse<IAnalyticsConfigModel>>(
      `${API_PATH_CONFIG.ANALYTICS_CONFIG}/${id}`,
      body
    );
    return response.data;
  };

  static deleteConfig = async (id: string) => {
    const response = await api.delete(
      `${API_PATH_CONFIG.ANALYTICS_CONFIG}/${id}`
    );
    return response.data;
  };

  static getReport = async (params: IAnalyticsReportQuery) => {
    const response = await api.get(
      API_PATH_CONFIG.ANALYTICS_REPORT,
      { params }
    );
    return response.data;
  };

  static getRealtimeReport = async (configId: string) => {
    const response = await api.get<IApiResponse<IAnalyticsRealtimeData>>(
      `${API_PATH_CONFIG.ANALYTICS_REALTIME}/${configId}`
    );
    return response.data;
  };
}
