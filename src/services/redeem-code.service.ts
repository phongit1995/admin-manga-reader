import type { IApiResponse, IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import {
    IRedeemCodeModel,
    IListRedeemCodeQuery,
    ICreateRedeemCodeRequest,
    IBatchCreateRedeemCodeRequest,
    IBatchCreateRedeemCodeResponse,
    IRedeemCodeStatsResponse,
} from "@src/types/redeem-code.type";

export class RedeemCodeService {
    static getListRedeemCode = async (query?: IListRedeemCodeQuery) => {
        const response = await api.get<IApiResponsePage<IRedeemCodeModel>>(
            API_PATH_CONFIG.REDEEM_CODE_LIST,
            { params: query }
        );
        return response.data;
    };

    static createRedeemCode = async (body: ICreateRedeemCodeRequest) => {
        const response = await api.post<IApiResponse<IRedeemCodeModel>>(
            API_PATH_CONFIG.REDEEM_CODE_CREATE,
            body
        );
        return response.data;
    };

    static batchCreateRedeemCode = async (body: IBatchCreateRedeemCodeRequest) => {
        const response = await api.post<IApiResponse<IBatchCreateRedeemCodeResponse>>(
            API_PATH_CONFIG.REDEEM_CODE_BATCH_CREATE,
            body
        );
        return response.data;
    };

    static getStats = async () => {
        const response = await api.get<IApiResponse<IRedeemCodeStatsResponse>>(
            API_PATH_CONFIG.REDEEM_CODE_STATS
        );
        return response.data;
    };

    static disableRedeemCode = async (code: string) => {
        const response = await api.put(
            `${API_PATH_CONFIG.REDEEM_CODE_DISABLE}/${code}`
        );
        return response.data;
    };

    static getDeviceHistory = async (deviceId: string) => {
        const response = await api.get<IApiResponse<IRedeemCodeModel[]>>(
            `${API_PATH_CONFIG.REDEEM_CODE_DEVICE_HISTORY}/${deviceId}/history`
        );
        return response.data;
    };
}
