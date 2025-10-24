import type { IStatisticsResponse } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class StatisticsService {
  static getCommonStatistics = async () => {
    const response = await api.get<IStatisticsResponse>(API_PATH_CONFIG.STATISTICS_COMMON);
    return response.data;
  }
}

