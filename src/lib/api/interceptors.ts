import { ApiError } from '@/types/api';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export function requestInterceptor(config: InternalAxiosRequestConfig) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const requestId = Math.random().toString(36).substring(7);
    config.headers['X-Request-ID'] = requestId;

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      requestId,
      timestamp: new Date().toISOString(),
      data: config.data,
      params: config.params,
    });
  }

  return config;
}

export function requestErrorInterceptor(error: AxiosError) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('[API Request Error]', error);
  }

  return Promise.reject(error);
}

export function responseInterceptor(response: AxiosResponse) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      timestamp: new Date().toISOString(),
      data: response.data,
    });
  }

  return response;
}

export function responseErrorInterceptor(error: AxiosError<ApiError>) {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('[API Response Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
  }

  const status = error.response?.status;

  if (status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  if (status === 403) {
    console.error('Permission denied:', error.response?.data?.message);
  }

  if (status === 500) {
    console.error('Server error:', error.response?.data?.message);
  }

  const transformedError: ApiError = {
    success: false,
    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
    code: error.code,
    details: error.response?.data?.details,
  };

  return Promise.reject(transformedError);
}
