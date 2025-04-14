import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(2, 'Username must be at least 2 characters'),
});

export const CarouselGenerationSchema = z.object({
  prompt: z.string().min(1).max(500),
  imageCount: z.number().int().min(1).max(10),
  style: z.enum(['modern', 'minimal', 'bold', 'elegant']).optional(),
  includeText: z.boolean().default(true),
  brandColors: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CarouselGenerationInput = z.infer<typeof CarouselGenerationSchema>;