export interface IStatisticsCommon {
  usersCount: number;
  mangasCount: number;
  novelsCount: number;
  purchasesCount: number;
  date: string;
}

export interface IStatisticsResponse {
  code: number;
  message: string;
  data: IStatisticsCommon;
  timestamp: string;
  path: string;
}

