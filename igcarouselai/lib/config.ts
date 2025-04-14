import { env } from './env';

export const config = {
  app: {
    name: 'Instagram Carousel AI',
    description: 'Create stunning carousel posts with AI assistance',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  },
  auth: {
    tokenExpiry: '1h',
    cookieName: 'auth_token',
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
    },
  },
  features: {
    maxCarouselImages: 10,
    maxPromptLength: 500,
    supportedStyles: ['modern', 'minimal', 'bold', 'elegant'] as const,
    maxBrandColors: 5,
  },
  premium: {
    monthlyPrice: 19,
    yearlyPrice: 190,
    enterprisePrice: 99,
    trialPeriodDays: 14,
    limits: {
      carouselsPerMonth: 50,
      storageGB: 10,
      teamMembers: 3,
    },
  },
  api: {
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100,
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
  session: {
    cleanup: {
      enabled: true,
      interval: 60 * 60 * 1000, // 1 hour
      maxAge: 24 * 60 * 60, // 24 hours
      batchSize: 100,
    },
  },
  monitoring: {
    suspiciousThreshold: 10,
    maxActivityEntries: 100,
    activityRetention: 7 * 24 * 60 * 60, // 7 days
  },
} as const;

// Type for carousel styles
export type CarouselStyle = typeof config.features.supportedStyles[number];

// Validate config at runtime
function validateConfig() {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  if (config.premium.yearlyPrice > config.premium.monthlyPrice * 12) {
    throw new Error('Yearly price cannot be higher than monthly price * 12');
  }
}

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  validateConfig();
}

export default config;