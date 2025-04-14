declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_API_BASE_URL?: string;
    ALLOWED_ORIGINS?: string;
  }
}