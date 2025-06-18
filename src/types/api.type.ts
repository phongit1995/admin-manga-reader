export interface IApiPageQuery {
    page?: number;
    pageSize?: number;
}

export interface IResponsePage<T> {
    data: T[],
    page: number;
    pageSize: number;
    total: number;
    totalPage: number;
};
export interface IApiResponsePage<T> {
    status: boolean;
    data?: IResponsePage<T>;
    message?: string;
    code: number;
    path: string;
}

export interface IApiResponse<T> {
    status: boolean;
    data?: IResponsePage<T>;
    message?: string;
    code: number;
    path: string;
}
