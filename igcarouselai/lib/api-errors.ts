import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ApiErrors = {
  ValidationError: (message: string) => new ApiError(message, 400, 'VALIDATION_ERROR'),
  Unauthorized: new ApiError('Unauthorized', 401, 'UNAUTHORIZED'),
  PaymentRequired: new ApiError('Payment required', 402, 'PAYMENT_REQUIRED'),
  Forbidden: new ApiError('Forbidden', 403, 'FORBIDDEN'),
  NotFound: new ApiError('Resource not found', 404, 'NOT_FOUND'),
  ConflictError: (message: string) => new ApiError(message, 409, 'CONFLICT'),
  RateLimitExceeded: new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED'),
  InternalError: new ApiError('Internal server error', 500, 'INTERNAL_ERROR'),
};

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.status }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}