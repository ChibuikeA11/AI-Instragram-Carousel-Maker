const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'] as const;

function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

// Validate on import
validateEnv();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
} as const;