/**
 * Domain-level errors. The API layer maps these onto HTTP responses so the
 * domain and application layers never depend on NestJS HTTP types.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} '${id}' was not found`, 'NOT_FOUND');
  }
}

export class ExternalProviderError extends AppError {
  constructor(provider: string, message: string) {
    super(`[${provider}] ${message}`, 'EXTERNAL_PROVIDER_ERROR');
  }
}

export class ProviderNotConfiguredError extends AppError {
  constructor(provider: string, hint: string) {
    super(`${provider} is not configured. ${hint}`, 'PROVIDER_NOT_CONFIGURED');
  }
}
