export class AIGenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIGenerationError';
  }
}

export const AIErrors = {
  InvalidPrompt: new AIGenerationError(
    'The provided prompt is invalid or too complex.',
    'INVALID_PROMPT',
    true
  ),
  ContentFiltered: new AIGenerationError(
    'The content was filtered due to safety concerns.',
    'CONTENT_FILTERED',
    true
  ),
  GenerationFailed: new AIGenerationError(
    'Failed to generate content. Please try again.',
    'GENERATION_FAILED',
    true
  ),
  QuotaExceeded: new AIGenerationError(
    'Monthly generation quota exceeded.',
    'QUOTA_EXCEEDED',
    false
  ),
  ServiceUnavailable: new AIGenerationError(
    'AI service is temporarily unavailable.',
    'SERVICE_UNAVAILABLE',
    true
  ),
};

export function isAIError(error: unknown): error is AIGenerationError {
  return error instanceof AIGenerationError;
}

export function handleAIError(error: unknown): { message: string; retryable: boolean } {
  if (isAIError(error)) {
    return {
      message: error.message,
      retryable: error.retryable
    };
  }

  return {
    message: 'An unexpected error occurred during content generation.',
    retryable: true
  };
}