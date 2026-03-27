import type { IApiPageQuery } from "./api.type";

export interface IListRedeemCodeQuery extends IApiPageQuery {
    status?: 'active' | 'used' | 'expired' | 'disabled';
    type?: '1_day' | '7_days' | '30_days' | 'event' | 'custom';
    limit?: number;
}

export interface IRedeemCodeModel {
    _id: string;
    code: string;
    vipDays: number;
    type: '1_day' | '7_days' | '30_days' | 'event' | 'custom';
    status: 'active' | 'used' | 'expired' | 'disabled';
    expiresAt?: string;
    description?: string;
    createdBy?: string;
    activatedAt?: string;
    usedByDeviceId?: string;
    deviceBrand?: string;
    deviceModel?: string;
    createdAt: string;
}

export interface ICreateRedeemCodeRequest {
    code?: string;
    prefix?: string;
    vipDays: number;
    type?: '1_day' | '7_days' | '30_days' | 'event' | 'custom';
    expiresAt?: string;
    description?: string;
}

export interface IBatchCreateRedeemCodeRequest {
    quantity: number;
    prefix?: string;
    vipDays: number;
    type?: '1_day' | '7_days' | '30_days' | 'event' | 'custom';
    expiresAt?: string;
    description?: string;
}

export interface IBatchCreateRedeemCodeResponse {
    count: number;
    codes: string[];
}

export interface IRedeemCodeStatsResponse {
    total: number;
    active: number;
    used: number;
    expired: number;
    disabled: number;
}
