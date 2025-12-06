import axios from 'axios';
import {
  requestErrorInterceptor,
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor,
} from './interceptors';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default apiClient;
