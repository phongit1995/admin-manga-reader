export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IAdminModel {
  _id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface IAdminLoginData {
  admin: IAdminModel;
  token: string;
}

export interface IAdminLoginResponse {
  code: number;
  message: string;
  data: IAdminLoginData;
  timestamp: string;
  path: string;
}

