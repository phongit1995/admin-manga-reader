import type { IApiResponsePage } from "src/types";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";
import { IInAppPurchaseModel, IListInAppPurchaseQuery } from "@src/types/in-app-purchase.type";

export class InAppPurchaseService {
    static getListInAppPurchase = async (query: IListInAppPurchaseQuery) => {
        const response = await api.get<IApiResponsePage<IInAppPurchaseModel>>(API_PATH_CONFIG.IN_APP_PURCHASE, { params: query });
        return response.data;
    }



    static deleteInAppPurchase = async (id: string) => {
        const response = await api.delete(API_PATH_CONFIG.IN_APP_PURCHASE + "/" + id);
        return response.data;
    }

}

