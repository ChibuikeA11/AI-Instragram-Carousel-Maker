export interface User {
  email: string;
  username: string;
  hasPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SessionResponse {
  user: User;
}

export interface CarouselPreview {
  previewUrl: string;
  estimatedTime: string;
  requestConfig: {
    prompt: string;
    imageCount: number;
    style?: string;
    includeText: boolean;
    brandColors?: string[];
    targetAudience?: string;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

// Union type for all possible API responses
export type ApiResponse<T> = T | ApiErrorResponse;