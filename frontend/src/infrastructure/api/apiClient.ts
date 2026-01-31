import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { config } from '../../config/env';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      axiosConfig => {
        const token = localStorage.getItem(config.tokenKey);
        if (token) {
          axiosConfig.headers.Authorization = `Bearer ${token}`;
        }
        return axiosConfig;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(config.tokenKey);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();
