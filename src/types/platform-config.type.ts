import type { IApiPageQuery } from "./api.type";

export interface IListPlatformConfigQuery extends IApiPageQuery {}

export interface IPlatformConfigModel {
    _id: string;
    packageId: string;
    platform: 'android' | 'ios';
    ironSourceAppKey: string;
    ironSourceUserId: string;
    ironSourceInterstitialAdUnitId: string;
    applovinSdkKey: string;
    applovinInterstitialAdUnit: string;
    isRandomAds: boolean;
    isShowApplovin: boolean;
    status: boolean;
}

export interface ICreatePlatformConfigRequest {
    packageId: string;
    platform: 'android' | 'ios';
    ironSourceAppKey?: string;
    ironSourceUserId?: string;
    ironSourceInterstitialAdUnitId?: string;
    applovinSdkKey?: string;
    applovinInterstitialAdUnit?: string;
    isRandomAds?: boolean;
    isShowApplovin?: boolean;
    status?: boolean;
}

export interface IUpdatePlatformConfigRequest {
    packageId?: string;
    platform?: 'android' | 'ios';
    ironSourceAppKey?: string;
    ironSourceUserId?: string;
    ironSourceInterstitialAdUnitId?: string;
    applovinSdkKey?: string;
    applovinInterstitialAdUnit?: string;
    isRandomAds?: boolean;
    isShowApplovin?: boolean;
    status?: boolean;
}
