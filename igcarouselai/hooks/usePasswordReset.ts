import { useState } from 'react';
import { useApi } from './useApi';
import { ApiErrorResponse } from '@/types/api';

interface ResetResponse {
  message: string;
  token?: string;
  debugEmail?: string;
}

export function usePasswordReset() {
  const api = useApi<ResetResponse>();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState<string | null>(null);

  const requestReset = async (email: string) => {
    const response = await api.request<ResetResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: { email },
    });

    if ('token' in response) {
      setResetToken(response.token);
      setStep('reset');
    }

    return response;
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const response = await api.request('/api/auth/reset-password', {
      method: 'PUT',
      body: { token, password: newPassword },
    });

    if (!('error' in response)) {
      setStep('request');
      setResetToken(null);
    }

    return response;
  };

  const goToRequestStep = () => {
    setStep('request');
    setResetToken(null);
  };

  return {
    step,
    resetToken,
    loading: api.loading,
    error: api.error,
    requestReset,
    resetPassword,
    goToRequestStep,
  };
}