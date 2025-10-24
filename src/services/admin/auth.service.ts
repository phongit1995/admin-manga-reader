import type { IAdminLoginRequest, IAdminLoginResponse } from "@src/types/admin-auth.type";

import { api } from "@api/api";
import { API_PATH_CONFIG } from "@config/api-path.config";

export class AdminAuthService {
  /**
   * Login admin user
   * @param credentials - Email and password
   * @returns Admin login response with token
   */
  static login = async (credentials: IAdminLoginRequest): Promise<IAdminLoginResponse> => {
    const response = await api.post<IAdminLoginResponse>(
      API_PATH_CONFIG.ADMIN_LOGIN,
      credentials
    );
    return response.data;
  };

  /**
   * Store authentication token in localStorage
   * @param token - JWT token
   */
  static setToken = (token: string): void => {
    localStorage.setItem('admin_token', token);
  };

  /**
   * Get authentication token from localStorage
   * @returns Token string or null
   */
  static getToken = (): string | null => localStorage.getItem('admin_token');

  /**
   * Remove authentication token from localStorage
   */
  static removeToken = (): void => {
    localStorage.removeItem('admin_token');
  };

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  static isAuthenticated = (): boolean => !!AdminAuthService.getToken();

  /**
   * Logout admin user
   */
  static logout = (): void => {
    AdminAuthService.removeToken();
  };
}

