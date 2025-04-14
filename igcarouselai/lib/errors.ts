import { ApiError } from './api-errors';
import { ZodError } from 'zod';

// Error codes mapping
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// User-friendly error messages
export const ErrorMessages = {
  [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again',
  [ErrorCodes.AUTH_ERROR]: 'Authentication failed. Please log in again',
  [ErrorCodes.PAYMENT_ERROR]: 'Payment verification failed. Please try again',
  [ErrorCodes.SERVER_ERROR]: 'Server error. Please try again later',
  [ErrorCodes.NETWORK_ERROR]: 'Network error. Please check your connection',
} as const;

// Format Zod validation errors
export function formatZodError(error: ZodError) {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
}

// Format API errors for display
export function formatApiError(error: ApiError) {
  return {
    code: error.code,
    message: error.message,
    status: error.status
  };
}

// Handle client-side errors
export function handleClientError(error: unknown): { message: string; code: string } {
  if (error instanceof ZodError) {
    const formattedErrors = formatZodError(error);
    return {
      message: formattedErrors[0]?.message || ErrorMessages.VALIDATION_ERROR,
      code: ErrorCodes.VALIDATION_ERROR
    };
  }

  if (error instanceof ApiError) {
    const formatted = formatApiError(error);
    return {
      message: formatted.message,
      code: formatted.code
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: ErrorCodes.SERVER_ERROR
    };
  }

  return {
    message: ErrorMessages.SERVER_ERROR,
    code: ErrorCodes.SERVER_ERROR
  };
}

// Check if error is a network error
export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    ('code' in error && error.code === 'NETWORK_ERROR' || 
     error.message.toLowerCase().includes('network') ||
     error.message.toLowerCase().includes('fetch'));
}

// Check if error requires authentication
export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && 
    (error.status === 401 || error.status === 403);
}