import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '@/types/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiErrorResponse) => void;
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const request = async <R = T>(
    url: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: unknown;
      config?: UseApiOptions<R>;
    }
  ): Promise<ApiResponse<R>> => {
    try {
      setLoading(true);
      setError(null);

      const { method = 'GET', body, config } = options || {};
      
      const response = await axios({
        url,
        method,
        data: body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data as R;
      
      if (config?.onSuccess) {
        config.onSuccess(result);
      }

      if (method === 'GET') {
        setData(result as unknown as T);
      }

      return result;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      const errorResponse = {
        error: {
          message: error.response?.data?.error?.message || 'An unexpected error occurred',
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        },
      };

      setError(errorResponse);
      
      if (options?.config?.onError) {
        options.config.onError(errorResponse);
      }

      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    request,
  };
}