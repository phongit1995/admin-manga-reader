import type { IApiPageQuery } from "./api.type";

export interface IListInAppPurchaseQuery extends IApiPageQuery {}

export interface IInAppPurchaseModel {
    _id: string;
    source: string;
    transactionId: string;
    originalTransactionId: string;
    webOrderLineItemId: string;
    bundleId: string;
    productId: string;
    subscriptionGroupIdentifier: string;
    purchaseDate: string;
    originalPurchaseDate: string;
    expiresDate: string;
    quantity: number;
    type: string;
    inAppOwnershipType: string;
    signedDate: string;
    environment: string;
    transactionReason: string;
    storefront: string;
    storefrontId: string;
    price: number;
    currency: string;
    appTransactionId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
