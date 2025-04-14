import { useApi } from './useApi';
import type { CarouselPreview } from '@/types/api';
import { CarouselGenerationSchema, type CarouselGenerationInput } from '@/lib/validations';

export function useCarousel() {
  const api = useApi<CarouselPreview>();

  const generateCarousel = async (input: CarouselGenerationInput) => {
    // Validate input against schema
    const result = CarouselGenerationSchema.safeParse(input);
    if (!result.success) {
      throw new Error(result.error.message);
    }

    return api.request<CarouselPreview>('/api/premium', {
      method: 'POST',
      body: result.data,
      config: {
        onError: (error) => {
          if (error.error.code === 'PAYMENT_REQUIRED') {
            // Redirect to pricing page or show upgrade modal
            window.location.href = '/pricing';
          }
        },
      },
    });
  };

  return {
    generateCarousel,
    isGenerating: api.loading,
    error: api.error,
    preview: api.data,
  };
}